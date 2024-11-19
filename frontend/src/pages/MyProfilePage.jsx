import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import EditProfile from './EditProfile';

const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const { logout } = useAuthStore();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    profilePicture: '',
    coverPhoto: '',
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    const fetchProfileData = async () => {
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
          setProfileData({
            name: data.user.name,
            bio: data.user.bio,
            profilePicture: data.user.profilePicture,
            coverPhoto: data.user.coverPhoto,
          });
        } else {
          console.error('Failed to fetch profile data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      }
    };

    fetchProfileData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Posts':
        return <div>Your posts will appear here.</div>;
      case 'Adopted Pets':
        return <div>Your adopted pets will appear here.</div>;
      case 'Ratings & Feedback':
        return <div>Your ratings and feedback will appear here.</div>;
      case 'Edit Profile':
        return <EditProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <nav className="p-4 space-y-2">
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-4">
            <img src="/images/logo.png" alt="Logo" className="h-16" />
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/my-profile')}
            className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
          >
            My Profile
          </button>
          <button
            onClick={() => navigate('/my-applications')}
            className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
          >
            My Applications
          </button>
          <button
            onClick={() => navigate('/adoption-history')}
            className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
          >
            Adoption History
          </button>
          <button
            onClick={() => navigate('/adoption-request')}
            className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
          >
            Adoption Request
          </button>
          <button
            onClick={() => navigate('/help-faqs')}
            className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
          >
            Help & FAQs
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
          >
            Log out
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
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

      {/* Profile Content */}
      <div className="max-w-8xl mx-auto p-4">
      <div className="relative flex items-center justify-center h-64 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <div className="absolute inset-0 flex justify-center">
            <img
              src={profileData.coverPhoto || '/path/to/default-cover.jpg'}
              alt="Cover"
              className="h-64 object-cover"
              style={{ maxWidth: '100%', width: '60%' }}
            />
          </div>
          <div className="absolute top-1/2 bottom-1/2 mt-16 transform -translate-y-1/2">
            <img
              src={profileData.profilePicture || '/path/to/default-profile.jpg'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>
        <div className="text-center mt-16 pt-4">
          <h1 className="text-2xl font-bold font-lora text-purple-600">{profileData.name}</h1>
          <p className="text-gray-600 p-4">{profileData.bio}</p>
        </div>
        <div className="mt-8">
          <nav className="flex justify-center space-x-8 border-b-2 border-gray-200">
            {['Posts', 'Adopted Pets', 'Ratings & Feedback', 'Edit Profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 ${
                  activeTab === tab ? 'border-b-4 border-purple-600 text-purple-600' : 'text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="mt-8 text-center">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
