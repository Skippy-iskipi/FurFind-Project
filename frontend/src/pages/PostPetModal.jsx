import { useState } from 'react';
import { postPet } from '../api/pet';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const PostPetModal = ({ isOpen, onClose }) => {
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        classification: '',
        breed: '',
        age: '',
        gender: '',
        location: '',
        description: '',
        image: null,
        status: 'Available'
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        }));
                    }, 'image/jpeg', 1);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const compressedFile = await compressImage(file);
                setFormData(prev => ({
                    ...prev,
                    image: compressedFile
                }));
                setImagePreview(URL.createObjectURL(compressedFile));
            } catch (error) {
                toast.error('Error processing image');
                console.error('Error compressing image:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add validation
        const requiredFields = ['name', 'classification', 'breed', 'age', 'gender', 'location'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        if (!formData.image) {
            toast.error('Please upload an image');
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Append all form data
            Object.keys(formData).forEach(key => {
                if (key === 'image') {
                    if (formData[key] instanceof File) {
                        formDataToSend.append('image', formData[key]);
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await postPet(formDataToSend);
            toast.success('Pet posted successfully!');
            
            // Reset form data to initial state
            setFormData({
                name: '',
                classification: '',
                breed: '',
                age: '',
                gender: '',
                location: '',
                description: '',
                image: null,
                status: 'Available'
            });
            
            // Clear image preview
            setImagePreview(null);
            
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to post pet');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="w-8">
                    </div>
                    <h2 className="text-2xl font-semibold text-purple-600 font-k2d">Post a Pet</h2>
                    <button
                        onClick={onClose}
                        className="px-1 py-1 text-[#7A62DC] rounded-md hover:bg-[#7A62DC] hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <hr className="border-gray-300 mb-6" />

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200">
                                {user?.profilePicture && (
                                    <img
                                        src={user.profilePicture || './images/default-profile.jpg'}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                )}
                            </div>
                            <span className="text-purple-600 font-semibold font-lora">
                                {user?.name || 'Loading...'}
                            </span>
                        </div>

                        <textarea
                                name="description"
                                placeholder="Description..."
                                className="mt-4 w-full p-3 border rounded-lg resize-none h-30"
                                value={formData.description}
                                onChange={handleInputChange}
                        />
                        <div className = "mt-4"></div>
                        <div className="bg-gray-100 rounded-lg p-4 h-[21.5rem] relative">
                            {imagePreview ? (
                                <div className="relative h-full">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData(prev => ({ ...prev, image: null }));
                                        }}
                                        className="absolute top-2 right-2 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center h-full flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <label className="cursor-pointer text-purple-600">
                                        Add Photo
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </label>
                                    <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-1 space-y-4">
                        <div>
                            <label className="block text-purple-600 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="w-full p-3 bg-blue-50 rounded-lg"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block text-purple-600 mb-2">
                                Classification <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="classification"
                                        value="Dog"
                                        checked={formData.classification === 'Dog'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Dog
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="classification"
                                        value="Cat"
                                        checked={formData.classification === 'Cat'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Cat
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-purple-600 mb-2">
                                Breed <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="breed"
                                className="w-full p-3 bg-blue-50 rounded-lg"
                                value={formData.breed}
                                onChange={handleInputChange}
                            >
                                <option value="">Select options...</option>
                                {formData.classification === 'Dog' && [
                                    'Aspin',
                                    'Labrador',
                                    'German Shepherd',
                                    'Golden Retriever',
                                    'American Bully',
                                    'Chow-chow',
                                    'Bulldog',
                                    'Poodle',
                                    'Beagle',
                                    'Rottweiler',
                                    'Dachshund',
                                    'Pomeranian',
                                    'Pug',
                                    'Chihuahua',
                                    'Husky',
                                    'Shih Tzu',
                                    'Mixed Breed'
                                ].map((breed) => (
                                    <option key={breed} value={breed}>{breed}</option>
                                ))}
                                {formData.classification === 'Cat' && [
                                    'Puspin',
                                    'Persian',
                                    'Maine Coon',
                                    'Siamese',
                                    'British Shorthair',
                                    'Ragdoll',
                                    'American Shorthair',
                                    'Scottish Fold',
                                    'Sphynx',
                                    'Bengal',
                                    'Russian Blue',
                                    'Abyssinian',
                                    'Norwegian Forest Cat',
                                    'Domestic Shorthair',
                                    'Domestic Longhair',
                                    'Mixed Breed'
                                ].map((breed) => (
                                    <option key={breed} value={breed}>{breed}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-purple-600 mb-2">
                                Age <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="age"
                                className="w-full p-3 bg-blue-50 rounded-lg"
                                value={formData.age}
                                onChange={handleInputChange}
                            >
                                <option value="">Select options...</option>
                                <option value="Baby">Baby</option>
                                <option value="Young">Young</option>
                                <option value="Teenager">Teenager</option>
                                <option value="Adult">Adult</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-purple-600 mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Male"
                                        checked={formData.gender === 'Male'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Male
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Female"
                                        checked={formData.gender === 'Female'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Female
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-purple-600 mb-2">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="location"
                                className="w-full p-3 bg-blue-50 rounded-lg"
                                value={formData.location}
                                onChange={handleInputChange}
                            >
                                <option value="">Select options...</option>
                                {[
                                    "Abucay",
                                    "Bagac",
                                    "Balanga",
                                    "Dinalupihan",
                                    "Hermosa",
                                    "Limay",
                                    "Mariveles",
                                    "Morong",
                                    "Orani",
                                    "Orion",
                                    "Pilar",
                                    "Samal",
                                ].map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="border-2 border-purple-300 text-purple-600 px-8 py-2 rounded-lg hover:bg-purple-600 hover:text-white"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostPetModal;