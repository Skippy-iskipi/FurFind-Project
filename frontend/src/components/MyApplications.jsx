import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApplicationDetails from './ApplicationDetails';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/adoption-applications-details', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const activeApplications = (response.data.applications || [])
          .filter(app => app.status !== 'Completed');
        setApplications(activeApplications);
        setFilteredApplications(activeApplications);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications(activeTab);
  }, [activeTab, applications]);

  const filterApplications = (status) => {
    if (status === 'All') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status.toLowerCase() === status.toLowerCase()));
    }
  };

  const closeModal = () => {
    setSelectedApplicationId(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex space-x-8 mb-4 border-b px-10">
        {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`pb-2 ${activeTab === status ? 'text-[#7A62DC] font-semibold border-b-2 border-[#7A62DC]' : 'text-gray-500'}`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div>No adoption applications yet.</div>
        ) : (
          filteredApplications.map((app, index) => (
            <div key={index} className="flex justify-between items-center p-4 border rounded-md bg-gray-100">
              <div className="flex items-center">
                <img src={app.petImage || '/path/to/default-avatar.png'} alt="Pet" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="text-md font-semibold">Application for {app.petName}</h3>
                  <p className="text-sm text-gray-600">
                    Applied on: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Date not available'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-md ${getStatusClass(app.status)}`}>
                  {app.status}
                </span>
                <button
                  onClick={() => {
                    console.log('Selected Application ID:', app._id);
                    setSelectedApplicationId(app._id);
                  }}
                  className="px-4 py-2 border border-[#7A62DC] text-[#7A62DC] rounded-md hover:bg-[#7A62DC] hover:text-white transition-colors"
                >
                  View Application
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedApplicationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f5f5f5] p-6 rounded-md shadow-md max-w-6xl h-[80vh]">
            <ApplicationDetails applicationId={selectedApplicationId} closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-[#FEF9C3] text-[#A16207]';
    case 'rejected':
      return 'bg-[#FEE2E2] text-[#B91C1C]';
    case 'approved':
      return 'bg-[#CFFAFE] text-[#0E7490]';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default MyApplications;
