import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import InsideSidebar from './InsideSidebar';

const InsideHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileData, setProfileData] = useState({ name: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/user-profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await response.json();
                if (data.success) {
                    setProfileData({ name: data.user.name });
                } else {
                    console.error('Failed to fetch user data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logged out');
    };

    return (
        <div>
            {/* Header */}
            <header className="bg-white shadow-md w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-purple-600">
                            <Menu className="text-purple-600" />
                        </button>
                        <img src="/images/logo.png" alt="FurFind" className="h-12 inline-block mr-2" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell className="text-purple-600" />
                        <span className="text-gray-600">Welcome, {profileData.name}</span>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <InsideSidebar isMenuOpen={isMenuOpen} handleLogout={handleLogout} />

            {/* Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)} />
            )}
        </div>
    );
};

export default InsideHeader;
