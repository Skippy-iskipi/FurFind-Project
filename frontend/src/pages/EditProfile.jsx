import React, { useState, useEffect } from 'react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    profilePicture: null,
    coverPhoto: null,
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
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
          setFormData({
            fullName: data.user.name,
            email: data.user.email,
            password: '',
            bio: data.user.bio,
            profilePicture: data.user.profilePicture,
            coverPhoto: data.user.coverPhoto,
          });
        } else {
          console.error('Failed to fetch user data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleDeleteProfilePicture = () => {
    setFormData({ ...formData, profilePicture: null });
  };

  const handleDeleteCoverPhoto = () => {
    setFormData({ ...formData, coverPhoto: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('bio', formData.bio);

    if (formData.profilePicture instanceof File) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    } else if (formData.profilePicture === null) {
      formDataToSend.append('profilePicture', '');
    }

    if (formData.coverPhoto instanceof File) {
      formDataToSend.append('coverPhoto', formData.coverPhoto);
    } else if (formData.coverPhoto === null) {
      formDataToSend.append('coverPhoto', '');
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log('Profile updated successfully:', data.message);
        setShowSuccessDialog(true);
      } else {
        console.error('Failed to update profile:', data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-8">
        <div className="text-center">
          <p className="text-1xl mb-4 text-left">Profile Picture</p>
          <img
            src={formData.profilePicture instanceof File ? URL.createObjectURL(formData.profilePicture) : formData.profilePicture || '/path/to/default/profile.jpg'}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover mx-auto mb-8"
          />
          <div className="mt-2 flex">
            <input type="file" name="profilePicture" onChange={handleFileChange} className="hidden" id="profilePicture" />
            <div className="flex justify-between">
              <label htmlFor="profilePicture" className="cursor-pointer bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 mr-5">Change picture</label>
              <button type="button" className="text-red-600" onClick={handleDeleteProfilePicture}>Delete picture</button>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-1xl mb-4 text-left">Cover Photo</p>
          <img
            src={formData.coverPhoto instanceof File ? URL.createObjectURL(formData.coverPhoto) : formData.coverPhoto || '/path/to/default/cover.jpg'}
            alt="Cover"
            className="w-96 h-64 object-cover mx-auto mb-8 rounded-lg"
          />
          <div className="mt-2">
            <input type="file" name="coverPhoto" onChange={handleFileChange} className="hidden" id="coverPhoto" />
            <div className="flex justify-end">
              <label htmlFor="coverPhoto" className="cursor-pointer bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 mr-5">Change picture</label>
              <button type="button" className="text-red-600 ml-2" onClick={handleDeleteCoverPhoto}>Delete picture</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 w-1/3">
        <label className="block text-left mb-2">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4 w-1/3">
        <label className="block text-left mb-2">Email address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4 w-1/3">
        <label className="block text-left mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4 w-1/3">
        <label className="block text-left mb-2">Edit Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows="4"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded mr-2 hover:bg-purple-800">Save changes</button>
        <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </form>
    {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Profile updated successfully!</p>
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;