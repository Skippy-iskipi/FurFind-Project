import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import ApplicationDetailsModal from './ApplicationDetailsModal';

const AdoptionRequest = ({ userRole }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        if (userRole === 'Pet Owner' || userRole === 'Animal Shelter') {
            fetchAdoptionRequests();
        }
    }, [userRole]);

    const fetchAdoptionRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/auth/adoption-requests', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setApplications(data.applications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch user adoption applications');
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationDetails = async (applicationId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/auth/application/${applicationId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setSelectedApplication(response.data.application);
                setIsModalOpen(true);
            } else {
                toast.error('Application data not found');
            }
        } catch (error) {
            console.error('Error fetching form:', error);
            toast.error('Failed to fetch application details');
        }
    };

    const fetchUserAdoptionApplications = async (applicationId) => {
        try {
            setLoading(true);
            
            // First, fetch the basic application details
            const applicationResponse = await axios.get(
                `http://localhost:5000/api/auth/application/${applicationId}`,
                { withCredentials: true }
            );

            // Then, fetch the form data
            const formResponse = await axios.get(
                `http://localhost:5000/api/auth/user-adoption-applications/${applicationId}`,
                { withCredentials: true }
            );

            if (applicationResponse.data.success && formResponse.data.success) {
                // Combine both responses
                const combinedData = {
                    ...applicationResponse.data.application,
                    formData: formResponse.data.applications[0]?.formData || {}
                };

                setSelectedApplication(combinedData);
                setIsModalOpen(true);
            } else {
                toast.error('Failed to fetch complete application details');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch user adoption applications');
        } finally {
            setLoading(false);
        }
    };

    const handleViewApplication = (applicationId) => {
        fetchApplicationDetails(applicationId);
        fetchUserAdoptionApplications(applicationId);
    };

    const getFilteredApplications = () => {
        if (activeTab === 'All') return applications;
        return applications.filter(app => app.status === activeTab);
    };

    const filteredApplications = getFilteredApplications();

    if (userRole === 'Adopter') {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-[#D4F5F5] rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 font-lora">Verification Required</h2>
                <p className="text-gray-600 mb-6 text-center">
                    You need to be verified as a Pet Owner or Animal Shelter to access adoption requests.
                </p>
                <button
                    onClick={() => navigate('/verification-application')}
                    className="bg-[#7A62DC] text-white px-6 py-2 rounded-md hover:bg-[#6249c7] transition-colors"
                >
                    Get Verified
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A62DC]"></div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex space-x-8 mb-4 border-b px-10">
                    {['All', 'Approved', 'Pending', 'Rejected', 'Completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 px-1 transition-colors relative ${
                                activeTab === tab
                                    ? 'text-[#7A62DC] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#7A62DC]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {applications.length === 0 || filteredApplications.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">
                            {applications.length === 0
                                ? "No adoption applications yet."
                                : `No ${activeTab.toLowerCase()} applications yet.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredApplications.map((application) => (
                            <div
                                key={application.id}
                                className="p-4 border rounded-md bg-gray-100"
                            >
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center space-x-5">
                                        <img
                                            src={application.petImage}
                                            alt={application.petName}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className="space-y-1">
                                            <h3 className="text-md font-semibold">
                                                Application for {application.petName}
                                            </h3>
                                            <p className="text-sm font-medium">
                                                Adopter: {application.adopterName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Applied on: {new Date(application.dateApplied).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-5 py-1 rounded-md text-sm ${
                                            application.status === 'Pending'
                                                ? 'bg-[#FEF9C3] text-[#A16207]'
                                                : application.status === 'Approved'
                                                ? 'bg-[#CFFAFE] text-[#0E7490]'
                                                : application.status === 'Completed'
                                                ? 'bg-[#DCFCE7] text-[#15803D]'
                                                : 'bg-[#FEE2E2] text-[#B91C1C]'
                                        }`}>
                                            {application.status}
                                        </span>
                                        <button
                                            onClick={() => handleViewApplication(application.id)}
                                            className="px-4 py-2 border border-[#7A62DC] text-[#7A62DC] rounded-md hover:bg-[#7A62DC] hover:text-white transition-colors"
                                        >
                                            View Application
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {selectedApplication && (
                <ApplicationDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    application={selectedApplication}
                />
            )}
        </>
    );
};

export default AdoptionRequest;