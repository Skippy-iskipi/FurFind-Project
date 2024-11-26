import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import ApplicationModal from '../components/ApplicationModal';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('userManagement');
    const [users, setUsers] = useState([]);
    const [verificationApplications, setVerificationApplications] = useState([]);
	const { logout } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
			toast.success('Logged out successfully');
		} catch (error) {
			toast.error('Failed to logout');
		}
	};

    useEffect(() => {
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

        const fetchVerificationApplications = async () => {
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
                console.log('Raw verification applications data:', data);
                if (data.success) {
                    setVerificationApplications(data.applications);
                } else {
                    console.error('Failed to fetch verification applications:', data.message);
                }
            } catch (error) {
                console.error('Error fetching verification applications:', error);
            }
        };


        if (activeTab === 'userManagement') {
            fetchUsers();
        } else if (activeTab === 'verificationApplications') {
            fetchVerificationApplications();
        }
    }, [activeTab]);

    const filteredApplications = verificationApplications.filter(application => {
        return (
            application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            application.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleReviewClick = (application) => {
        console.log('Full application data:', application);
        setSelectedApplication(application);
        setIsModalOpen(true);
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
                {/* Tabs */}
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
                        className={`relative py-2 text-lg font-semibold ${activeTab === 'verificationApplications' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('verificationApplications')}
                    >
                        Verification Applications
                        {activeTab === 'verificationApplications' && (
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
                {activeTab === 'verificationApplications' && (
                    <div>
                        <div className="mt-10 mb-5 flex justify-between items-center">
                            <h2 className="text-xl font-semibold mb-4">Verification Applications</h2>
                            <input
                                type="text"
                                placeholder="Search applications..."
                                className="border border-gray-300 rounded-md p-2 w-1/6 focus:border-[#7A62DC] focus:outline-none"
                                value={searchQuery} // Bind the input value to searchQuery
                                onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                            />
                        </div>
                        <div className="border rounded-lg p-4">
                            {filteredApplications.map(application => (
                                <div key={application.email} className="p-2 border-b flex items-center">
                                    <img
                                        src={application.profilePicture || './images/default-profile.jpg'}
                                        alt={`${application.name}'s profile`}
                                        className="h-16 w-16 rounded-full mr-5"
                                    />
                                    <div className='font-opensans'>
                                        <h3 className="font-semibold">{application.name}</h3>
                                        <p>{application.email}</p>
                                        <p>Submitted: {new Date(application.submittedDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="bg-[#7A62DC] text-white px-3 py-1 rounded-full mr-2">{application.type}</span>
                                        <button 
                                            className='font-medium border-2 border-[#7A62DC] py-2 px-2 rounded-md text-[#7A62DC] hover:bg-[#7A62DC] hover:text-[#f5f5f5]'
                                            onClick={() => handleReviewClick(application)}
                                        >
                                            Review Application
                                        </button>
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
            </main>

            {/* Add the Modal */}
            <ApplicationModal 
                application={selectedApplication}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default AdminDashboard;
