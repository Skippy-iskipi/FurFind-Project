import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdoptionHistory = () => {
    const { token } = useAuthStore();
    const [completedApplications, setCompletedApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCompletedApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/auth/completed-adoption-applications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            if (response.data.success) {
                setCompletedApplications(response.data.applications);
            } else {
                throw new Error('Failed to fetch completed applications');
            }
        } catch (error) {
            console.error('Error fetching completed applications:', error);
            toast.error(error.message || 'Failed to fetch completed applications');
        } finally {
            setLoading(false);
        }
    };

    const handleViewApplication = async (applicationId) => {
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
            toast.error('Failed to fetch application details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedApplications();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A62DC]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {completedApplications.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No completed adoptions found
                </div>
            ) : (
                completedApplications.map((application) => (
                    <div 
                        key={application.id} 
                        className="flex justify-between items-center p-4 border rounded-md bg-gray-100"
                    >
                        <div className="flex items-center space-x-4">
                            <img
                                src={application.petImage}
                                alt={application.petName}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-medium">Application for {application.petName}</h3>
                                <p className="text-sm text-gray-500">
                                    Applied on: {new Date(application.dateApplied).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 rounded-md text-sm bg-[#DCFCE7] text-[#15803D]">
                                Completed
                            </span>
                            <button
                                onClick={() => handleViewApplication(application.id)}
                                className="px-4 py-2 text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white border border-[#7A62DC] rounded-md transition-colors"
                            >
                                View Application
                            </button>
                        </div>
                    </div>
                ))
            )}

            <ApplicationDetailsModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedApplication(null);
                }}
                application={selectedApplication}
            />
        </div>
    );
};

export default AdoptionHistory; 