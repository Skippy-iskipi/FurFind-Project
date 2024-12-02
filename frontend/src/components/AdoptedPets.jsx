import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { formatTimeAgo } from '../utils/dateUtils';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdoptedPets = () => {
    const { token } = useAuthStore();
    const [adoptedByMe, setAdoptedByMe] = useState([]);
    const [adoptedFromMe, setAdoptedFromMe] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('adopted_by_me');

    const fetchAdoptedPets = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/auth/adopted-pets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                setAdoptedByMe(data.applications.adoptedByMe);
                setAdoptedFromMe(data.applications.adoptedFromMe);
            }
        } catch (error) {
            console.error('Error fetching adopted pets:', error);
            toast.error('Failed to fetch adopted pets');
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
        fetchAdoptedPets();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A62DC]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200">
                <button
                    className={`pb-4 px-4 text-lg font-semibold relative ${
                        activeTab === 'adopted_by_me'
                            ? 'text-[#7A62DC] border-b-2 border-[#7A62DC]'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('adopted_by_me')}
                >
                    My Adoptions
                    {adoptedByMe.length > 0 && (
                        <span className="ml-2 bg-[#7A62DC] text-white rounded-full px-2 py-1 text-xs">
                            {adoptedByMe.length}
                        </span>
                    )}
                </button>
                <button
                    className={`pb-4 px-4 text-lg font-semibold relative ${
                        activeTab === 'adopted_from_me'
                            ? 'text-[#7A62DC] border-b-2 border-[#7A62DC]'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('adopted_from_me')}
                >
                    Adopted From Me
                    {adoptedFromMe.length > 0 && (
                        <span className="ml-2 bg-[#7A62DC] text-white rounded-full px-2 py-1 text-xs">
                            {adoptedFromMe.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'adopted_by_me' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {adoptedByMe.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-12">
                            No pets adopted yet
                        </div>
                    ) : (
                        adoptedByMe.map((pet) => (
                            <div key={pet.id} className="bg-[#E0F4F4] rounded-2xl overflow-hidden p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-medium text-gray-800">{pet.petName}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatTimeAgo(pet.dateAdopted)}
                                    </span>
                                </div>
                                <div className="relative mb-3">
                                    <img
                                        src={pet.petImage}
                                        alt={pet.petName}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium bg-[#3B82F6] text-white">
                                        Adopted
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-gray-600 text-left">
                                        Previous Owner: <span className="text-[#7A62DC] font-bold">{pet.ownerName}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleViewApplication(pet.id)}
                                    className="w-full mt-4 bg-[#7A62DC] text-white py-2 rounded-md hover:bg-[#6952B7] transition-colors"
                                >
                                    View Application Details
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'adopted_from_me' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {adoptedFromMe.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-12">
                            None of your pets have been adopted yet
                        </div>
                    ) : (
                        adoptedFromMe.map((pet) => (
                            <div key={pet.id} className="bg-[#E0F4F4] rounded-2xl overflow-hidden p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-medium text-gray-800">{pet.petName}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatTimeAgo(pet.dateAdopted)}
                                    </span>
                                </div>
                                <div className="relative mb-3">
                                    <img
                                        src={pet.petImage}
                                        alt={pet.petName}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium bg-[#3B82F6] text-white">
                                        Adopted
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-gray-600 text-left">
                                        Adopted by: <span className="text-[#7A62DC] font-bold">{pet.adopterName}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleViewApplication(pet.id)}
                                    className="w-full mt-4 bg-[#7A62DC] text-white py-2 rounded-md hover:bg-[#6952B7] transition-colors"
                                >
                                    View Application Details
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedApplication && (
                <ApplicationDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedApplication(null);
                    }}
                    application={selectedApplication}
                    onActionComplete={fetchAdoptedPets}
                />
            )}
        </div>
    );
};

export default AdoptedPets;