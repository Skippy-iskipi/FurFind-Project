import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import VerificationReviewModal from '../components/VerificationReviewModal';
import ShelterModal from '../components/ShelterModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserInfoModal from '../components/UserInfoModal';

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
    const [applications, setApplications] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [unreadApplications, setUnreadApplications] = useState(0);
    const [unreadShelterApplications, setUnreadShelterApplications] = useState(0);

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
                setPetOwnerApplications([]);
            }
        } catch (error) {
            console.error('Error fetching pet owner applications:', error);
            setPetOwnerApplications([]);
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
                setAnimalShelterApplications([]);
            }
        } catch (error) {
            console.error('Error fetching animal shelter applications:', error);
            setAnimalShelterApplications([]);
        }
    };

    const fetchUnreadApplicationsCount = async () => {
        try {
            const token = localStorage.getItem('token');
            // Fetch Pet Owner Applications count
            const petOwnerResponse = await fetch('http://localhost:5000/api/auth/verification-applications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const petOwnerData = await petOwnerResponse.json();
            
            // Fetch Animal Shelter Applications count
            const shelterResponse = await fetch('http://localhost:5000/api/auth/animal-shelter-applications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const shelterData = await shelterResponse.json();

            if (petOwnerData.success) {
                const pendingPetOwners = petOwnerData.applications.filter(app => app.status === 'Pending').length;
                setUnreadApplications(pendingPetOwners);
            }
            
            if (shelterData.success) {
                const pendingShelters = shelterData.applications.filter(app => app.status === 'Pending').length;
                setUnreadShelterApplications(pendingShelters);
            }
        } catch (error) {
            console.error('Error fetching unread applications:', error);
        }
    };

    useEffect(() => {
        fetchUnreadApplicationsCount();
    }, []);

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
        ? (petOwnerApplications || [])
            .filter(application => 
                application.status === statusFilter
            )
            .filter(application =>
                !searchQuery || (
                    (application.googleUser?.name || application.formData?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (application.googleUser?.email || application.formData?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        : (animalShelterApplications || [])
            .filter(application => 
                application.status === statusFilter
            )
            .filter(application =>
                !searchQuery || (
                    (application.formData?.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (application.formData?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                )
            );

    console.log('Current Status Filter:', statusFilter);
    console.log('Current Applications:', petOwnerApplications || animalShelterApplications);
    console.log('Filtered Applications:', filteredApplications);

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

    const fetchApplications = async () => {
        // Your fetch logic here
    };

    const handleOpenModal = (application) => {
        console.log('Opening modal with application:', application);
        setSelectedApplication(application);
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
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
                        className={`relative py-2 text-md font-semibold ${activeTab === 'userManagement' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('userManagement')}
                    >
                        User Management
                        {activeTab === 'userManagement' && (
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#7A62DC]"></span>
                        )}
                    </button>
                    <button
                        className={`relative py-2 text-md font-semibold ${activeTab === 'petOwnerApplications' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('petOwnerApplications')}
                    >
                        Pet Owner Applications
                        {unreadApplications > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadApplications}
                            </span>
                        )}
                        {activeTab === 'petOwnerApplications' && (
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#7A62DC]"></span>
                        )}
                    </button>
                    <button
                        className={`relative py-2 text-md font-semibold ${activeTab === 'animalShelterApplications' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('animalShelterApplications')}
                    >
                        Animal Shelter Applications
                        {unreadShelterApplications > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadShelterApplications}
                            </span>
                        )}
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
                                placeholder="Search user..."
                                value={userSearchQuery}
                                onChange={(e) => setUserSearchQuery(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-1/6 focus:border-[#7A62DC] focus:outline-none"
                            />
                        </div>
                        <div className="border rounded-md p-4">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <button
                                        key={user.email}
                                        className="w-full text-left p-2 border-b hover:bg-gray-50 transition-colors"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <div className="flex items-center">
                                            <img
                                                src={user.profilePicture || './images/default-profile.jpg'}
                                                alt={`${user.name}'s profile`}
                                                className="h-10 w-10 rounded-full mr-2"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{user.name}</h3>
                                                <p>{user.email}</p>
                                                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No users found matching your search
                                </div>
                            )}
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
                            <input
                                type="text"
                                placeholder="Search application..."
                                className="border border-gray-300 rounded-md p-2 w-1/3 focus:border-[#7A62DC] focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Add Status Tabs */}
                        <div className="flex space-x-8 mb-6 border-b">
                            {['Pending', 'Approved', 'Rejected'].map((status) => (
                                <button
                                    key={status}
                                    className={`relative py-2 px-1 text-base font-medium ${
                                        statusFilter === status 
                                            ? 'text-[#7A62DC]' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => setStatusFilter(status)}
                                >
                                    {status}
                                    {statusFilter === status && (
                                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#7A62DC]"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="border rounded-md p-4">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((application) => (
                                <div key={application.id} className="p-4 border-b last:border-b-0 flex items-center justify-between">
                                    <div className="flex items-center flex-1">
                                        <img
                                            src={application.profilePicture || '/images/default-profile.jpg'}
                                            alt={`${application.name}'s profile`}
                                            className="h-16 w-16 rounded-full object-cover mr-5"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/default-profile.jpg';
                                            }}
                                        />
                                        <div className='font-opensans'>
                                            <h3 className="font-semibold text-md">
                                                {application.name || 'No Name Available'}
                                            </h3>
                                            <p className="text-gray-600">{application.email || 'No Email Available'}</p>
                                            <p className="text-gray-500 text-sm">
                                                Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-sm ${
                                            application.status === 'Pending' 
                                                ? 'bg-[#FFF4E5] text-[#FF9800]'
                                                : application.status === 'Approved'
                                                ? 'bg-[#E2F8F5] text-[#0C8577]'
                                                : 'bg-[#FFE7E7] text-[#E53535]'
                                        }`}>
                                            {application.status}
                                        </span>
                                        {application.status === 'Pending' && (
                                            <button 
                                                className='font-medium border-2 border-[#7A62DC] py-2 px-4 rounded-md text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors duration-200'
                                                onClick={() => handleReviewClick(application)}
                                            >
                                                Review Application
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No {statusFilter.toLowerCase()} applications found
                            </div>
                        )}
                        </div>
                        <div className="flex justify-end mt-6 gap-2">
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={`page-${page}`}
                                    className={`px-4 py-2 ${
                                        page === 1
                                            ? 'bg-[#7A62DC] text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } rounded-md`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            {activeTab === 'petOwnerApplications' && (
                <VerificationReviewModal
                    isOpen={isVerificationModalOpen}
                    onClose={handleCloseModal}
                    application={selectedApplication}
                    onActionComplete={fetchPetOwnerApplications}
                />
            )}

            {activeTab === 'animalShelterApplications' && (
                <ShelterModal
                    application={selectedApplication}
                    isOpen={isShelterModalOpen}
                    onClose={handleCloseModal}
                    onActionComplete={fetchAnimalShelterApplications}
                />
            )}

            <UserInfoModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                user={selectedUser}
            />
        </div>
    );
};

export default AdminDashboard;