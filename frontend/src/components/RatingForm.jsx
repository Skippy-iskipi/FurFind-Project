import React, { useState } from 'react';

const RatingForm = ({ onSubmit, onCancel }) => {
  const [feedback, setFeedback] = useState('');
  const [stars, setStars] = useState(0);

  const handleStarClick = (rating) => {
    setStars(rating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stars === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit({ feedback, stars });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#f5f5f5] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Rate your Transaction</h2>
      <p className="text-xs mb-2 text-gray-800">
        Please rate your experience with the pet caretaker.
      </p>
      <p className="mb-4 text-xs text-gray-800">
        Your feedback is essential in helping us ensure that all parties involved in the adoption process are trustworthy and reliable.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border rounded-md mb-4"
          placeholder="Your Feedback Here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="4"
        />
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => handleStarClick(star)}
              className={`h-8 w-8 cursor-pointer ${star <= stars ? 'text-yellow-500' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z" />
            </svg>
          ))}
        </div>
        <p className="text-center mb-4">Select a rating</p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#d2d2d2] rounded-md text-[#222222] hover:bg-[#d2d2d2]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#7A62DC] text-white rounded-md hover:bg-[#6348c9]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;