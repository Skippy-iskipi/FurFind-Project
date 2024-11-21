import { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';

const InsideHeader = ({ isMenuOpen, setIsMenuOpen }) => {
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

    return (
        <header className="bg-white shadow-md w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-purple-600">
                        <Menu className="text-purple-600" />
                    </button>
                    <img src="/images/logo.png" alt="FurFind" className="w-32 h-12" />
                </div>
                <div className="flex items-center gap-4">
                    <Bell className="text-purple-600" />
                    <span className="text-gray-600">Welcome, {profileData.name}</span>
                </div>
            </div>
        </header>
    );
};

export default InsideHeader;
