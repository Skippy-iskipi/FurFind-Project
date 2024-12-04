import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { X } from 'lucide-react';

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
        console.log(response.data.application.adopter);
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
      <div className="text-right">
        <button
          onClick={closeModal}
          className="px-2 py-1 text-[#7A62DC] rounded-md hover:bg-[#7A62DC] hover:text-white transition-colors"
        >
          <X size={25} />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4 font-k2d">Application Status</h2>
      <div className="grid grid-cols-2 gap-6">
        <img
          src={application.pet.image}
          alt={application.pet.name}
          className="w-full h-96 object-cover rounded-md"
        />
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 border border-gray-300 rounded-md">
            <p className="mb-3 font-openSans">
                <strong className="font-semibold mr-2">Status:</strong> 
                <span className={`px-2 py-1 rounded-md ${
                    application.status === 'Pending' ? 'bg-[#FEF9C3] text-[#A16207]' : 
                    application.status === 'Approved' ? 'bg-[#CFFAFE] text-[#0E7490]' :
                    application.status === 'Rejected' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                    'bg-gray-100 text-gray-600'
                }`}>
                    {application.status}
                </span>
            </p>
            <p className="mb-3 font-openSans"><strong className="font-semibold mr-2">Name:</strong> {application.pet.name}</p>
            <p className="mb-3 font-openSans"><strong className="font-semibold mr-2">Classification:</strong> {application.pet.classification}</p>
            <p className="mb-3 font-openSans"><strong className="font-semibold mr-2">Breed:</strong> {application.pet.breed}</p>
            <p className="mb-3 font-openSans"><strong className="font-semibold mr-2">Gender:</strong> {application.pet.gender}</p>
            <p className="mb-3 font-openSans"><strong className="font-semibold mr-2">Age:</strong> {application.pet.age}</p>
            <p className="mb-3 font-openSans"><strong className="font-semibold mr-2">Location:</strong> {application.pet.location}</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2 p-4 border border-gray-300 rounded-md w-full">
                {console.log('Owner data:', application.owner)}
                <h3 className="font-semibold">{application.owner.role}</h3>
                <p>{application.owner.name}</p>
                <p className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-[#7A62DC] inline mr-2" /> {application.owner.contact}
                </p>
                <p className="truncate">
                  <EnvelopeIcon className="h-5 w-5 text-[#7A62DC] inline mr-2" /> {application.owner.email}
                </p>
            </div>
            <div className="flex flex-col gap-2 p-4 border border-gray-300 rounded-md w-full">
                <h3 className="font-semibold">Adopter</h3>
                <p>{application.adopter.name}</p>
                <p className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-[#7A62DC] inline mr-2" /> {application.adopter.contactNumber}
                </p>
                <p className="truncate">
                  <EnvelopeIcon className="h-5 w-5 text-[#7A62DC] inline mr-2" /> {application.adopter.email}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
