import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import { formatTimeAgo } from '../utils/dateUtils';

const UserAdoptedPets = ({ userId, token }) => {
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAdoptedPets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/auth/adopted-pets/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setAdoptedPets(response.data.pets || []);
      } else {
        console.error('Failed to fetch adopted pets:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching adopted pets:', error);
      toast.error('Failed to fetch adopted pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAdoptedPets();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A62DC]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adoptedPets.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No adopted pets found
          </div>
        ) : (
          adoptedPets.map((pet) => (
            <div key={pet._id} className="bg-[#E0F4F4] rounded-2xl overflow-hidden p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">{pet.name}</h3>
                <span className="text-sm text-gray-500">
                  {formatTimeAgo(pet.createdAt)}
                </span>
              </div>
              <div className="relative mb-3">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium bg-[#3B82F6] text-white">
                  Adopted
                </span>
              </div>
              <div className="mt-2">
                <p className="text-gray-600 text-left">
                  Adopted by: <span className="text-[#7A62DC] font-bold">{pet.userId.name}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

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
