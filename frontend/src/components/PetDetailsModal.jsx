import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
}

const PetDetailsModal = ({ pet, onClose }) => {
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [posterName, setPosterName] = useState('');
    const [posterProfilePicture, setPosterProfilePicture] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decoded = parseJwt(token);
            if (decoded) {
                setCurrentUserId(decoded.userId);
            }
        } else {
            console.log('No token found');
        }

        const fetchPosterDetails = async () => {
            try {
                const userId = pet.userId?._id || pet.userId;

                if (!userId) {
                    console.log('No userId found');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`, {
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.success) {
                    setPosterName(data.user.name);
                    setPosterProfilePicture(data.user.profilePicture);
                } else {
                    console.log('Failed to fetch user data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching poster details:', error);
            }
        };

        fetchPosterDetails();
    }, [pet]);

    useEffect(() => {
        if (pet.status === 'Adopted') {
            fetchApplicationDetails();
        }
    }, [pet._id]);

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/auth/pet-application/${pet._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();
            if (data.success) {
                setApplicationDetails(data.application);
            }
        } catch (error) {
            console.error('Error fetching application details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (pet.status === 'Adopted' && !loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-semibold">Application Details</h2>
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                Completed on {new Date(applicationDetails?.completedAt).toLocaleDateString()}
                            </span>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pet Image */}
                        <div>
                            <img
                                src={pet.image}
                                alt={pet.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>

                        {/* Pet Information */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Pet Information</h3>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <p><span className="font-medium">Name:</span> {pet.name}</p>
                                    <p><span className="font-medium">Classification:</span> {pet.classification}</p>
                                    <p><span className="font-medium">Breed:</span> {pet.breed}</p>
                                    <p><span className="font-medium">Gender:</span> {pet.gender}</p>
                                    <p><span className="font-medium">Age:</span> {pet.age}</p>
                                    <p><span className="font-medium">Location:</span> {pet.location}</p>
                                </div>
                            </div>

                            {/* Adopter Information */}
                            <div>
                                <h3 className="text-lg font-semibold">Adopter Information</h3>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <p><span className="font-medium">Name:</span> {applicationDetails?.userId?.name}</p>
                                    <p><span className="font-medium">Contact:</span> {applicationDetails?.userId?.phoneNumber}</p>
                                    <p><span className="font-medium">Email:</span> {applicationDetails?.userId?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Original pet details modal for non-adopted pets
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Back Button */}
                <div className="p-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-2 py-1 text-[#7A62DC] rounded-md hover:bg-[#7A62DC] hover:text-white transition-colors"
                    >
                        <X size={25} />
                    </button>
                </div>

                <div className="pl-6 pr-6 pt-0 pb-6">
                    {/* User Info Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={posterProfilePicture || './images/default-profile.jpg'}
                                alt={posterName || 'Anonymous'}
                                className="w-12 h-12 rounded-full object-cover mr-2 bg-gray-200 cursor-pointer"
                                onClick={() => navigate(`/user-profile/${pet.userId?._id || pet.userId}`)}
                            />
                            <div>
                                <h2
                                    className="font-semibold text-lg cursor-pointer"
                                    onClick={() => navigate(`/user-profile/${pet.userId?._id || pet.userId}`)}
                                >
                                    {posterName || 'Anonymous'}
                                </h2>
                                <p className="text-gray-500 text-sm text-left">{formatTimeAgo(pet.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 text-left">
                        {pet.description || 'No description available'}
                    </p>

                    {/* Pet Image */}
                    <div className="mb-6">
                        <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-full rounded-lg object-cover max-h-[400px]"
                        />
                    </div>

                    {/* Pet Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Name:</p>
                            <p className="text-gray-700">{pet.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Gender:</p>
                            <p className="text-gray-700">{pet.gender}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Classification:</p>
                            <p className="text-gray-700">{pet.classification}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Age:</p>
                            <p className="text-gray-700">{pet.age}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Breed:</p>
                            <p className="text-gray-700">{pet.breed}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Location:</p>
                            <p className="text-gray-700">{pet.location}</p>
                        </div>
                    </div>

                    {/* Apply Button */}
                    {String(pet.userId?._id || pet.userId) !== String(currentUserId) && (
                        <button
                            className="w-full bg-[#7A62DC] text-white py-2 rounded-md hover:bg-[#6249c7] transition-colors mt-8"
                            onClick={() => navigate(`/adoption-application/${pet._id}`)}
                        >
                            Apply for Adoption
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetDetailsModal;