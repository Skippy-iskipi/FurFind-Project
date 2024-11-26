import { formatTimeAgo } from '../utils/dateUtils';
import { useState, useEffect } from 'react';
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Back Button */}
                <div className="p-4 text-left">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 border border-[#7A62DC] text-[#7A62DC] rounded-md hover:bg-[#7A62DC] hover:text-white transition-colors"
                    >
                        Back
                    </button>
                </div>

                <div className="p-6">
                    {/* User Info Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={posterProfilePicture || './images/default-profile.jpg'}
                                alt={posterName || 'Anonymous'}
                                className="w-12 h-12 rounded-full object-cover mr-2 bg-gray-200"
                            />
                            <div>
                                <h2 className="font-semibold text-lg">{posterName || 'Anonymous'}</h2>
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