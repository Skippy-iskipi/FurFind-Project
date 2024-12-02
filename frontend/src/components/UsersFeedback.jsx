import React, { useState, useEffect } from 'react';

const UsersFeedback = ({ userId }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/user-ratings/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        if (data.success) {
          setFeedbackData(data.ratings || []);
          setFilteredData(data.ratings || []);
        } else {
          console.error('Failed to fetch feedback data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching feedback data:', error.message);
      }
    };

    fetchFeedbackData();
  }, [userId]);

  useEffect(() => {
    if (filter === 0) {
      setFilteredData(feedbackData);
    } else {
      setFilteredData(feedbackData.filter(feedback => feedback.stars === filter));
    }
  }, [filter, feedbackData]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-left">User Ratings & Feedback</h2>
      <div className="flex space-x-2 mb-4">
        {[5, 4, 3, 2, 1].map(star => (
          <button
            key={star}
            onClick={() => setFilter(star)}
            className={`px-3 py-1 rounded ${filter === star ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
          >
            <span className="text-yellow-500">{'★'.repeat(star)}</span>
            <span className="text-gray-300">{'☆'.repeat(5 - star)}</span>
          </button>
        ))}
      </div>
      {filteredData.length > 0 ? (
        filteredData.map((feedback, index) => (
          <div key={index} className="border p-4 mb-4 rounded-lg">
            <div className="flex items-center mb-2">
              <img
                src={feedback.adopterId.profilePicture || '/images/default-profile.jpg'}
                alt="User"
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold">{feedback.adopterId.name}</h3>
                <div className="flex">
                  <span className="text-yellow-500">{'★'.repeat(feedback.stars)}</span>
                  <span className="text-gray-300">{'☆'.repeat(5 - feedback.stars)}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-left ml-14">{feedback.feedback}</p>
            <div className="text-right text-[#222222] relative bottom-20">
              {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No feedback available.</p>
      )}
    </div>
  );
};

export default UsersFeedback;
