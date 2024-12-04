import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import EditProfile from './EditProfile';
import MyPosts from './MyPosts';
import AdoptedPets from '../components/AdoptedPets';
import RatingsFeedback from '../components/RatingsFeedback';

const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const { logout } = useAuthStore();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    profilePicture: '',
    coverPhoto: '',
    role: '',
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
            role: data.user.role,
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

  const handleUserSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/search?query=${query}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.users);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Posts':
        return <MyPosts />;
      case 'Adopted Pets':
        return <AdoptedPets />;
      case 'Ratings & Feedback':
        return <RatingsFeedback userRole={profileData.role} />;
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
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/my-profile')}
            className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors"
          >
            My Profile
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors"
          >
            My Applications
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors"
          >
            Adoption History
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors"
          >
            Adoption Request
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors"
          >
            Help & FAQs
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white transition-colors"
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
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#7A62DC]">
              <Menu className="text-[#7A62DC]" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="h-12 inline-block mr-2"
            >
              <img
                src="/images/logo.png"
                alt="FurFind"
                className="h-full"
              />
            </button>
            
            {/* Moved search here and made it shorter */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7A62DC] w-5 h-5" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchQuery}
                onChange={(e) => handleUserSearch(e.target.value)}
                className="border border-gray-300 px-10 py-2 rounded-lg w-full focus:outline-none focus:border-[#7A62DC] focus:ring-1 focus:ring-[#7A62DC] transition-colors"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        navigate(`/user-profile/${user._id}`);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <img
                        src={user.profilePicture || '/images/default-profile.jpg'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="text-[#7A62DC]" />
            <span className="text-gray-600">Welcome, {profileData.name}</span>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-8xl mx-auto p-4">
      <div className="relative flex items-center justify-center h-64 bg-gradient-to-r from-[#7A62DC] to-[#58E6E0] rounded-lg">
          <div className="absolute inset-0 flex justify-center">
            <img
              src={profileData.coverPhoto || '/images/logo1.png'}
              alt="Cover"
              className="h-64 w-[60%] object-cover cursor-pointer"
              onClick={() => setIsCoverModalOpen(true)}
            />
          </div>
          <div className="absolute top-1/2 bottom-1/2 mt-16 transform -translate-y-1/2">
            <img
              src={profileData.profilePicture || '/images/default-profile.jpg'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
        <div className="text-center mt-16 pt-4">
          <h1 className="text-2xl font-bold font-lora text-[#7A62DC]">{profileData.name}</h1>
          <p className="text-gray-600 p-4">{profileData.bio}</p>
        </div>
        <div className="mt-8">
          <nav className="flex justify-center space-x-8 border-b-2 border-gray-200">
            {['Posts', 'Adopted Pets', 'Ratings & Feedback', 'Edit Profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 ${
                  activeTab === tab ? 'border-b-4 border-[#7A62DC] text-[#7A62DC]' : 'text-gray-500'
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
      {/* Modal for larger image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-[#7A62DC] text-5xl absolute top-1 right-5"
            >
              &times;
            </button>
            <img
              src={profileData.profilePicture || '/images/default-profile.jpg'}
              alt="Profile Large"
              className="w-full h-[90vh] rounded-md"
            />
          </div>
        </div>
      )}
      {/* Modal for larger cover photo */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-lg relative">
            <button
              onClick={() => setIsCoverModalOpen(false)}
              className="text-[#7A62DC] text-5xl absolute top-1 right-5"
            >
              &times;
            </button>
            <img
              src={profileData.coverPhoto || '/images/logo1.png'}
              alt="Cover Large"
              className="w-full h-[90vh] rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfilePage;