import React, { useState, useEffect } from 'react';

const UserInfoModal = ({ isOpen, onClose, user }) => {
    const [verificationData, setVerificationData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            fetchUserData();
        }
    }, [isOpen, user]);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Determine which endpoint to use based on user role
            const endpoint = user.role === 'Animal Shelter' 
                ? 'animal-shelter-applications'
                : 'verification-applications';

            const response = await fetch(
                `http://localhost:5000/api/auth/${endpoint}`,
                { headers }
            );
            const result = await response.json();
            if (result.success) {
                const userVerification = result.applications.find(
                    app => app.email === user.email
                );
                setVerificationData(userVerification);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderVerificationDetails = () => {
        if (!verificationData) return null;

        if (user.role === 'Animal Shelter') {
            return (
                <>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Organization Name</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.organizationName}</div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Registration Number</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.registrationNumber}</div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Year Established</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.yearEstablished}</div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Shelter Address</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.shelterAddress}</div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.shelterContact}</div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Complete Address</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.address}</div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.contactNumber}</div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Occupation</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.occupation}</div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Emergency Contact Name</label>
                        <div className="bg-gray-50 p-2 rounded">
                            {verificationData.emergencyFirstName} {verificationData.emergencyLastName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Emergency Contact Number</label>
                        <div className="bg-gray-50 p-2 rounded">{verificationData.emergencyContact}</div>
                    </div>
                </>
            );
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">User Profile</h2>
                        <p className="text-gray-500 text-sm">Detailed information about the user</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A62DC]"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center mb-6">
                            <img
                                src={user.profilePicture || './images/default-profile.jpg'}
                                alt={`${user.name}'s profile`}
                                className="h-20 w-20 rounded-full mr-4 object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <p className="text-gray-600">{user.email}</p>
                                {verificationData && (
                                    <span className="inline-block bg-purple-500 text-white text-sm px-3 py-1 rounded-full mt-1">
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Role</label>
                                <div className="bg-gray-50 p-2 rounded">{user.role}</div>
                            </div>
                            {renderVerificationDetails()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserInfoModal;