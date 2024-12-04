import React, { useState } from 'react';
import axios from 'axios';
import InsideHeader from '../components/InsideHeader';
import { useParams, useNavigate } from 'react-router-dom';

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
}

const AdoptionApplication = () => {
    const { petId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        address: '',
        contactNumber: '',
        occupation: '',
        emergencyFirstName: '',
        emergencyLastName: '',
        emergencyAddress: '',
        emergencyContact: '',
        typeOfResidence: '',
        residenceOwnership: '',
        hadPetsBefore: '',
        hasCurrentPets: '',
        petCareDescription: '',
        certifyInformation: false,
        governmentId: null,
        proofOfResidence: null,
        proofOfIncome: null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const clearForm = () => {
        setFormData({
            address: '',
            contactNumber: '',
            occupation: '',
            emergencyFirstName: '',
            emergencyLastName: '',
            emergencyAddress: '',
            emergencyContact: '',
            typeOfResidence: '',
            residenceOwnership: '',
            hadPetsBefore: '',
            hasCurrentPets: '',
            petCareDescription: '',
            certifyInformation: false,
            governmentId: null,
            proofOfResidence: null,
            proofOfIncome: null,
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (type === 'file') {
            setFormData({ ...formData, [name]: files });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const decoded = parseJwt(token);
            const userId = decoded ? decoded.userId : null;

            if (!userId) {
                alert('User ID is missing');
                return;
            }

            if (!petId) {
                alert('Pet ID is missing');
                return;
            }

            const data = new FormData();
            data.append('userId', userId);
            data.append('petId', petId);
            data.append('address', formData.address);
            data.append('contactNumber', formData.contactNumber);
            data.append('occupation', formData.occupation);
            data.append('emergencyFirstName', formData.emergencyFirstName);
            data.append('emergencyLastName', formData.emergencyLastName);
            data.append('emergencyAddress', formData.emergencyAddress);
            data.append('emergencyContact', formData.emergencyContact);
            data.append('typeOfResidence', formData.typeOfResidence);
            data.append('residenceOwnership', formData.residenceOwnership);
            data.append('hadPetsBefore', formData.hadPetsBefore);
            data.append('hasCurrentPets', formData.hasCurrentPets);
            data.append('petCareDescription', formData.petCareDescription);
            data.append('certifyInformation', formData.certifyInformation);
            if (formData.governmentId && formData.governmentId.length > 0) {
                data.append('governmentId', formData.governmentId[0]);
            }
            if (formData.proofOfResidence && formData.proofOfResidence.length > 0) {
                data.append('proofOfResidence', formData.proofOfResidence[0]);
            }
            if (formData.proofOfIncome && formData.proofOfIncome.length > 0) {
                data.append('proofOfIncome', formData.proofOfIncome[0]);
            }

            const response = await axios.post('http://localhost:5000/api/adoption/submit', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            clearForm();
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
            alert('Error submitting application');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/dashboard');
    };

    return (
        <div className="w-full h-full">
            <InsideHeader />
            <div className="max-w-8xl mx-auto pt-12 pl-8 pr-8">
                <h1 className="text-2xl font-bold mb-4">Adoption Application</h1>
                <p className="mb-6 text-xs">Please complete all required information</p>
            </div>
            <div className="space-y-8 border-2 rounded-md p-16 ml-8 mr-8 mt-12">
                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-12 mb-20">
                        <div>
                            <h2 className="text-md font-bold mb-4">Basic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Complete Address</label>
                                    <textarea 
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                                        rows="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Contact Number</label>
                                    <input 
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        type="tel"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Occupation</label>
                                    <input 
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div>
                            <h2 className="text-md font-bold mb-4">Emergency Contact</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4 w-full">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-semibold mb-1">First Name</label>
                                    <input
                                        name="emergencyFirstName"
                                        value={formData.emergencyFirstName}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-semibold mb-1">Last Name</label>
                                        <input
                                            name="emergencyLastName"
                                            value={formData.emergencyLastName}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Complete Address</label>
                                    <textarea 
                                        name="emergencyAddress"
                                        value={formData.emergencyAddress}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                                        rows="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Contact Number</label>
                                    <input 
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        type="tel"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pet Care Information and Required Documents */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-md font-bold mb-4">Pet Care Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Type of Residence</label>
                                    <select 
                                        name="typeOfResidence"
                                        value={formData.typeOfResidence}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="House">House</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Condo">Condo</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Do you own or rent?</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input 
                                                type="radio"
                                                name="residenceOwnership"
                                                value="Own"
                                                checked={formData.residenceOwnership === 'Own'}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Own
                                        </label>
                                        <label className="flex items-center">
                                            <input 
                                                type="radio"
                                                name="residenceOwnership"
                                                value="Rent"
                                                checked={formData.residenceOwnership === 'Rent'}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Rent
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Have you had pets before?</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input 
                                                type="radio"
                                                name="hadPetsBefore"
                                                value="Yes"
                                                checked={formData.hadPetsBefore === 'Yes'}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Yes
                                        </label>
                                        <label className="flex items-center">
                                            <input 
                                                type="radio"
                                                name="hadPetsBefore"
                                                value="No"
                                                checked={formData.hadPetsBefore === 'No'}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Do you have other pets currently?</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input 
                                                type="radio"
                                                name="hasCurrentPets"
                                                value="Yes"
                                                checked={formData.hasCurrentPets === 'Yes'}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Yes
                                        </label>
                                        <label className="flex items-center">
                                            <input 
                                                type="radio"
                                                name="hasCurrentPets"
                                                value="No"
                                                checked={formData.hasCurrentPets === 'No'}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">How will you care for the pet?</label>
                                    <textarea 
                                        name="petCareDescription"
                                        value={formData.petCareDescription}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                                        rows="3"
                                        placeholder="Describe your plans for pet care, including exercise, feeding, and medical care"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-md font-bold mb-4">Required Documents</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Valid Government ID</label>
                                    <input
                                        type="file"
                                        name="governmentId"
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-purple-600 hover:file:bg-purple-100"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Upload a clear photo/scan of any valid government ID
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Proof of Residence</label>
                                    <input
                                        type="file"
                                        name="proofOfResidence"
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-purple-600 hover:file:bg-purple-100"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Utility bill or lease agreement from the last 1 month
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Proof of Income</label>
                                    <input
                                        type="file"
                                        name="proofOfIncome"
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-purple-600 hover:file:bg-purple-100"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Recent payslip or bank statement
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        name="certifyInformation"
                                        checked={formData.certifyInformation}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                    />
                                    <span className="text-sm">
                                        I certify that all information and documents provided are true and correct. I understand that providing false information may result in the rejection of my application.
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button type="submit" className="px-4 py-2 border-2 border-[#7A62DC] text-[#7A62DC] rounded-md cursor-pointer hover:bg-[#7A62DC] hover:text-white transition-colors">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#D4F5F5] p-8 rounded-lg shadow-lg relative max-w-md w-full mx-4">
                <img src="/images/application.png" alt="Success" className="w-15 h-15 relative top-[-10px] left-[-10px]" />
                <button onClick={onClose} className="absolute top-5 right-5 text-[#7A62DC] text-4xl">
                    &times;
                </button>
                <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#222222] font-lora w-full text-left">Your application has been submitted</h2>
                </div>
                <p className="text-[#222222] text-xs font-opensans">
                    Thank you for your application! Please wait for the update on your adoption application.
                </p>
            </div>
        </div>
    );
};

export default AdoptionApplication;