import React, { useState } from 'react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: '',
    profilePicture: null,
    coverPhoto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to the server
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <img
            src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : '/path/to/default/profile.jpg'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <button type="button" className="text-purple-600">Change picture</button>
            <button type="button" className="text-red-600 ml-2">Delete picture</button>
          </div>
        </div>
        <div>
          <img
            src={formData.coverPhoto ? URL.createObjectURL(formData.coverPhoto) : '/path/to/default/cover.jpg'}
            alt="Cover"
            className="w-64 h-32 object-cover"
          />
          <div>
            <button type="button" className="text-purple-600">Change picture</button>
            <button type="button" className="text-red-600 ml-2">Delete picture</button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block">Email address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block">Edit Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows="4"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded mr-2">Save changes</button>
        <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default EditProfile;
