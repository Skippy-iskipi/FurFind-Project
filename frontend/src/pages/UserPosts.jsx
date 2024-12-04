import { useState, useEffect } from 'react';
import { formatTimeAgo } from '../utils/dateUtils';
import PetDetailsModal from '../components/PetDetailsModal';

const UserPosts = ({ userId, token }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);

  const fetchUserPets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/auth/user-pets/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        const availablePets = data.pets.filter(pet => pet.status === 'Available');
        setPets(availablePets);
      } else {
        console.error('Fetch error:', data.message);
        setPets([]); // Reset pets if no data
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setPets([]); // Reset pets on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserPets();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : pets.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              This user has not posted any available pets yet.
            </div>
          ) : (
            pets.map((pet) => (
              <div key={pet._id} className="bg-[#E0F4F4] rounded-2xl overflow-hidden p-4 hover:shadow-lg transition-shadow">
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
                  <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                    {pet.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <span className="bg-[#7A62DC] text-white px-3 py-1 rounded-full text-sm">
                      {pet.classification}
                    </span>
                    <span className="text-gray-600">
                      Age: {pet.age}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-gray-600">
                    <p>Breed: {pet.breed}</p>
                    <p>Location: {pet.location}</p>
                  </div>
                </div>
                <button
                  className="w-full mt-4 bg-[#7A62DC] text-white py-2 rounded-md hover:bg-[#6249c7] transition-colors"
                  onClick={() => setSelectedPet(pet)}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {selectedPet && (
        <PetDetailsModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
};

export default UserPosts;