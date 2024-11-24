import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplicationDetails = ({ applicationId, closeModal }) => {
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/application-details/${applicationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setApplication(response.data.application);
      } catch (err) {
        setError('Error fetching application details');
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <button
        onClick={closeModal}
        className="px-4 py-1 mb-4 border border-[#7A62DC] text-[#7A62DC] rounded-md hover:bg-[#7A62DC] hover:text-white transition-colors"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4 font-k2d">Application Status</h2>
      <div className="grid grid-cols-2 gap-6">
        <img
          src={application.pet.image}
          alt={application.pet.name}
          className="w-full h-full object-cover rounded-md"
        />
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 border border-gray-300 rounded-md">
            <p className="mb-3 font-openSans"><strong>Status:</strong> <span className="bg-[#FEF9C3] text-[#A16207] px-2 py-1 rounded-md">{application.status}</span></p>
            <p className="mb-3 font-openSans"><strong>Name:</strong> {application.pet.name}</p>
            <p className="mb-3 font-openSans"><strong>Classification:</strong> {application.pet.classification}</p>
            <p className="mb-3 font-openSans"><strong>Breed:</strong> {application.pet.breed}</p>
            <p className="mb-3 font-openSans"><strong>Gender:</strong> {application.pet.gender}</p>
            <p className="mb-3 font-openSans"><strong>Age:</strong> {application.pet.age}</p>
            <p className="mb-3 font-openSans"><strong>Location:</strong> {application.pet.location}</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="mb-4 p-4 border border-gray-300 rounded-md">
                <h3 className="font-semibold">Pet Owner</h3>
                <p>{application.owner.name}</p>
                <p>📞 {application.owner.contactNumber}</p>
                <p>✉️ {application.owner.email}</p>
            </div>
            <div className="p-4 border border-gray-300 rounded-md">
                <h3 className="font-semibold">Adopter</h3>
                <p>{application.adopter.name}</p>
                <p>📞 {application.adopter.contactNumber}</p>
                <p>✉️ {application.adopter.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
