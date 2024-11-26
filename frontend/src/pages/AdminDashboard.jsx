import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import VerificationReviewModal from '../components/VerificationReviewModal';
import ShelterModal from '../components/ShelterModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('userManagement');
    const [users, setUsers] = useState([]);
    const [petOwnerApplications, setPetOwnerApplications] = useState([]);
    const [animalShelterApplications, setAnimalShelterApplications] = useState([]);
    const { logout } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isShelterModalOpen, setIsShelterModalOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            } else {
                console.error('Failed to fetch users:', data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchPetOwnerApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/verification-applications', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setPetOwnerApplications(data.applications);
            } else {
                console.error('Failed to fetch pet owner applications:', data.message);
            }
        } catch (error) {
            console.error('Error fetching pet owner applications:', error);
        }
    };

    const fetchAnimalShelterApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/animal-shelter-applications', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setAnimalShelterApplications(data.applications);
            } else {
                console.error('Failed to fetch animal shelter applications:', data.message);
            }
        } catch (error) {
            console.error('Error fetching animal shelter applications:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'userManagement') {
            fetchUsers();
        } else if (activeTab === 'petOwnerApplications') {
            fetchPetOwnerApplications();
        } else if (activeTab === 'animalShelterApplications') {
            fetchAnimalShelterApplications();
        }
    }, [activeTab]);

    const filteredApplications = activeTab === 'petOwnerApplications'
        ? petOwnerApplications.filter(application => 
            application.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            application.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : animalShelterApplications.filter(application =>
            application.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            application.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleReviewClick = (application) => {
        setSelectedApplication(application);
        if (activeTab === 'petOwnerApplications') {
            setIsVerificationModalOpen(true);
        } else {
            setIsShelterModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsVerificationModalOpen(false);
        setIsShelterModalOpen(false);
        setSelectedApplication(null);
        if (activeTab === 'petOwnerApplications') {
            fetchPetOwnerApplications();
        } else if (activeTab === 'animalShelterApplications') {
            fetchAnimalShelterApplications();
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="bg-white shadow-md w-full">
                <div className="w-full px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src="/images/logo.png" alt="FurFind" className="h-12 inline-block mr-2" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-[#7A62DC] text-white px-4 py-2 rounded-md hover:bg-[#6249c7] transition-colors" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4">
                {/* Updated Tabs */}
                <div className="flex space-x-8 mb-4">
                    <button
                        className={`relative py-2 text-lg font-semibold ${activeTab === 'userManagement' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('userManagement')}
                    >
                        User Management
                        {activeTab === 'userManagement' && (
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#7A62DC]"></span>
                        )}
                    </button>
                    <button
                        className={`relative py-2 text-lg font-semibold ${activeTab === 'petOwnerApplications' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('petOwnerApplications')}
                    >
                        Pet Owner Applications
                        {activeTab === 'petOwnerApplications' && (
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#7A62DC]"></span>
                        )}
                    </button>
                    <button
                        className={`relative py-2 text-lg font-semibold ${activeTab === 'animalShelterApplications' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('animalShelterApplications')}
                    >
                        Animal Shelter Applications
                        {activeTab === 'animalShelterApplications' && (
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#7A62DC]"></span>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'userManagement' && (
                    <div>
                        <div className="mt-10 mb-5 flex justify-between items-center">
                            <h2 className="text-xl font-semibold mb-4">Users</h2>
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="border border-gray-300 rounded-md p-2 w-1/6 focus:border-[#7A62DC] focus:outline-none"
                            />
                        </div>
                        <div className="border rounded-lg p-4">
                            {users.map(user => (
                                <div key={user.email} className="p-2 border-b flex items-center">
                                    <img
                                        src={user.profilePicture || './images/default-profile.jpg'}
                                        alt={`${user.name}'s profile`}
                                        className="h-10 w-10 rounded-full mr-2"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{user.name}</h3>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination */}
                        <div className="flex justify-end mt-4 space-x-2">
                            <button className="px-4 py-2 bg-[#7A62DC] text-white rounded-md">1</button>
                            <button className="px-4 py-2 bg-gray-200 rounded-md">2</button>
                            <button className="px-4 py-2 bg-gray-200 rounded-md">3</button>
                            <button className="px-4 py-2 bg-gray-200 rounded-md">Next</button>
                        </div>
                    </div>
                )}
                {(activeTab === 'petOwnerApplications' || activeTab === 'animalShelterApplications') && (
                    <div>
                        <div className="mt-10 mb-5 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                {activeTab === 'petOwnerApplications' ? 'Pet Owner Applications' : 'Animal Shelter Applications'}
                            </h2>
                            <input
                                type="text"
                                placeholder="Search applications..."
                                className="border border-gray-300 rounded-md p-2 w-1/6 focus:border-[#7A62DC] focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="border rounded-lg p-4">
                            {filteredApplications.map(application => (
                                <div key={application.email} className="p-4 border-b last:border-b-0 flex items-center justify-between">
                                    <div className="flex items-center flex-1">
                                        <img
                                            src={application.profilePicture || '/images/default-profile.jpg'}
                                            alt={`${activeTab === 'petOwnerApplications' ? application.name : application.organizationName}'s profile`}
                                            className="h-16 w-16 rounded-full object-cover mr-5"
                                        />
                                        <div className='font-opensans'>
                                            <h3 className="font-semibold text-lg">
                                                {activeTab === 'petOwnerApplications' 
                                                    ? application.name 
                                                    : application.organizationName}
                                            </h3>
                                            <p className="text-gray-600">{application.email}</p>
                                            <p className="text-gray-500 text-sm">
                                                Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="bg-[#7A62DC] text-white px-4 py-1.5 rounded-full text-sm">
                                            {activeTab === 'petOwnerApplications' ? 'Pet Owner' : 'Animal Shelter'}
                                        </span>
                                        <button 
                                            className='font-medium border-2 border-[#7A62DC] py-2 px-4 rounded-md text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors duration-200'
                                            onClick={() => handleReviewClick(application)}
                                        >
                                            Review Application
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-6 gap-2">
                            <button className="px-4 py-2 bg-[#7A62DC] text-white rounded-md">1</button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">2</button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">3</button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Next</button>
                        </div>
                    </div>
                )}
            </main>

            {/* Separate Modals */}
            {activeTab === 'petOwnerApplications' && (
                <VerificationReviewModal
                    isOpen={isVerificationModalOpen}
                    onClose={handleCloseModal}
                    application={selectedApplication}
                />
            )}

            {activeTab === 'animalShelterApplications' && (
                <ShelterModal
                    application={selectedApplication}
                    isOpen={isShelterModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default AdminDashboard;