import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import { formatTimeAgo } from '../utils/dateUtils';
import { FaStar } from 'react-icons/fa';

const UserAdoptedPets = ({ userId, token }) => {
  const [adoptedByUser, setAdoptedByUser] = useState([]);
  const [adoptedFromUser, setAdoptedFromUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('adopted_by_user');
  const [userData, setUserData] = useState(null);

  const fetchAdoptedPets = async () => {
    try {
      setLoading(true);
      const adoptedResponse = await axios.get(
        `http://localhost:5000/api/auth/adopted-pets/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        }
      );

      const ratingsResponse = await axios.get(
        `http://localhost:5000/api/auth/user-ratings/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        }
      );

      if (adoptedResponse.data.success && ratingsResponse.data.success) {
        const ratingsMap = ratingsResponse.data.ratings.reduce((acc, rating) => {
          acc[rating.petId] = rating.stars;
          return acc;
        }, {});

        const adoptedByMeWithRatings = (adoptedResponse.data.applications.adoptedByMe || [])
          .map(pet => ({
            ...pet,
            rating: ratingsMap[pet.petId] || 0
          }))
          .sort((a, b) => new Date(b.dateAdopted) - new Date(a.dateAdopted));

        const adoptedFromMeWithRatings = (adoptedResponse.data.applications.adoptedFromMe || [])
          .map(pet => ({
            ...pet,
            rating: ratingsMap[pet.petId] || 0
          }))
          .sort((a, b) => new Date(b.dateAdopted) - new Date(a.dateAdopted));

        setAdoptedByUser(adoptedByMeWithRatings);
        setAdoptedFromUser(adoptedFromMeWithRatings);
      } else {
        console.error('Failed to fetch data:', 
          adoptedResponse.data.message || ratingsResponse.data.message
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch adoption data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/user/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchAdoptedPets();
    }
  }, [userId]);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A62DC]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button
          className={`pb-4 px-4 text-lg font-semibold relative ${
            activeTab === 'adopted_by_user'
              ? 'text-[#7A62DC] border-b-2 border-[#7A62DC]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('adopted_by_user')}
        >
          <div className="flex items-center">
            <p>Adopted by <span className="font-bold">{userData?.name || 'User'}</span></p>
            {adoptedByUser.length > 0 && (
              <span className="ml-2 bg-[#7A62DC] text-white rounded-full px-2 py-1 text-xs">
                {adoptedByUser.length}
              </span>
            )}
          </div>
        </button>
        <button
          className={`pb-4 px-4 text-lg font-semibold relative ${
            activeTab === 'adopted_from_user'
              ? 'text-[#7A62DC] border-b-2 border-[#7A62DC]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('adopted_from_user')}
        >
          Adopted From Them
          {adoptedFromUser.length > 0 && (
            <span className="ml-2 bg-[#7A62DC] text-white rounded-full px-2 py-1 text-xs">
              {adoptedFromUser.length}
            </span>
          )}
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'adopted_by_user' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adoptedByUser.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              No pets adopted yet
            </div>
          ) : (
            adoptedByUser.map((pet) => (
              <div key={pet.id} className="bg-[#E0F4F4] rounded-2xl overflow-hidden p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800">{pet.petName}</h3>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(pet.dateAdopted)}
                  </span>
                </div>
                <div className="relative mb-3">
                  <img
                    src={pet.petImage}
                    alt={pet.petName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium bg-[#3B82F6] text-white">
                    Adopted
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-600 text-left">
                    Previous Owner: <span className="text-[#7A62DC] font-bold">{pet.ownerName}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'adopted_from_user' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adoptedFromUser.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              None of their pets have been adopted yet
            </div>
          ) : (
            adoptedFromUser.map((pet) => (
              <div key={pet.id} className="bg-[#E0F4F4] rounded-2xl overflow-hidden p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800">{pet.petName}</h3>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(pet.dateAdopted)}
                  </span>
                </div>
                <div className="relative mb-3">
                  <img
                    src={pet.petImage}
                    alt={pet.petName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium bg-[#3B82F6] text-white">
                    Adopted
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-600 text-left mb-2">
                    Adopted by: <span className="text-[#7A62DC] font-bold">{pet.adopterName}</span>
                  </p>
                  <StarRating rating={pet.rating || 0} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedApplication && (
        <ApplicationDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          onActionComplete={fetchAdoptedPets}
        />
      )}
    </div>
  );
};

export default UserAdoptedPets;
