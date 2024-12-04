import React, { useState } from 'react';
import axios from 'axios';
import InsideHeader from '../components/InsideHeader';


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

const VerificationApplication = () => {
    const [formType, setFormType] = useState('Pet Owner');
    const [formData, setFormData] = useState({
        address: '',
        contactNumber: '',
        occupation: '',
        emergencyFirstName: '',
        emergencyLastName: '',
        emergencyAddress: '',
        emergencyContact: '',
        petCareExperience: '',
        certifyInformation: false,
        agreeToGuidelines: false,
        governmentId: null,
        proofOfResidence: null,
        organizationName: '',
        registrationNumber: '',
        yearEstablished: '',
        shelterType: '',
        shelterAddress: '',
        shelterContact: '',
        organizationalBackground: '',
        registrationCertificate: null,
        facilityPhotos: [],
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
            petCareExperience: '',
            certifyInformation: false,
            agreeToGuidelines: false,
            governmentId: null,
            proofOfResidence: null,
            organizationName: '',
            registrationNumber: '',
            yearEstablished: '',
            shelterType: '',
            shelterAddress: '',
            shelterContact: '',
            organizationalBackground: '',
            registrationCertificate: null,
            facilityPhotos: [],
        });
    };

    const handleTypeChange = (type) => {
        setFormType(type);
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

            const data = new FormData();
            data.append('type', formType);
            data.append('userId', userId);

            // Append form data based on type
            if (formType === 'Pet Owner') {
                data.append('address', formData.address);
                data.append('contactNumber', formData.contactNumber);
                data.append('occupation', formData.occupation);
                data.append('emergencyFirstName', formData.emergencyFirstName);
                data.append('emergencyLastName', formData.emergencyLastName);
                data.append('emergencyAddress', formData.emergencyAddress);
                data.append('emergencyContact', formData.emergencyContact);
                data.append('petCareExperience', formData.petCareExperience);
                data.append('certifyInformation', formData.certifyInformation);
                data.append('agreeToGuidelines', formData.agreeToGuidelines);
                if (formData.governmentId && formData.governmentId.length > 0) {
                    data.append('governmentId', formData.governmentId[0]);
                }
                if (formData.proofOfResidence && formData.proofOfResidence.length > 0) {
                    data.append('proofOfResidence', formData.proofOfResidence[0]);
                }
            } else if (formType === 'Animal Shelter') {
                data.append('organizationName', formData.organizationName);
                data.append('registrationNumber', formData.registrationNumber);
                data.append('yearEstablished', formData.yearEstablished);
                data.append('shelterType', formData.shelterType);
                data.append('shelterAddress', formData.shelterAddress);
                data.append('shelterContact', formData.shelterContact);
                data.append('organizationalBackground', formData.organizationalBackground);
                if (formData.registrationCertificate && formData.registrationCertificate.length > 0) {
                    data.append('registrationCertificate', formData.registrationCertificate[0]);
                }
                if (formData.facilityPhotos && formData.facilityPhotos.length > 0) {
                    Array.from(formData.facilityPhotos).forEach((file) => data.append('facilityPhotos', file));
                }
            }

            const response = await axios.post('http://localhost:5000/api/verification/submit', data, {
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

    return (
        <div className="w-full h-full">
            <InsideHeader />
            <div className="w-full px-4 sm:px-6 md:px-8 py-10">
                <h1 className="text-2xl font-bold mb-4">Verification Application</h1>
                <p className="mb-6 text-xs">Get verified to post pets for adoption on FurFind</p>
                <div className="flex space-x-4 mb-10">
                    <button
                        onClick={() => handleTypeChange('Pet Owner')}
                        className={`px-12 py-2 border-2 rounded-md ${formType === 'Pet Owner' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
                    >
                        <span className="text-[14px]">Pet Owner</span>
                        <p className="text-xs text-gray-400">Individual wanting to rehome pets</p>
                    </button>
                    <button
                        onClick={() => handleTypeChange('Animal Shelter')}
                        className={`px-12 py-2 border-2 rounded-md ${formType === 'Animal Shelter' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
                    >
                        <span className="text-[14px]">Animal Shelter</span>
                        <p className="text-xs text-gray-400">Organization dedicated to animal welfare</p>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8 w-full border-2 rounded-md p-16">
                    {formType === 'Pet Owner' ? (
                        <div className="grid grid-cols-2 gap-12 pl-8 pr-8">
                            <div className="space-y-8">
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
                                                placeholder="9XX XXX XXXX"
                                                maxLength="12"
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

                                <div>
                                    <h2 className="text-md font-bold mb-4">Required Documents</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Valid Government ID</label>
                                            <input
                                                type="file"
                                                name="governmentId"
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-purple-600 hover:file:bg-purple-100 cursor-pointer"
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
                                                className="w-full border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-purple-600 hover:file:bg-purple-100 cursor-pointer"
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Utility bill or lease agreement from the last 1 month
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-md font-bold mb-4">Emergency Contact</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">First Name</label>
                                                <input
                                                    name="emergencyFirstName"
                                                    value={formData.emergencyFirstName}
                                                    onChange={handleChange}
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">Last Name</label>
                                                <input
                                                    name="emergencyLastName"
                                                    value={formData.emergencyLastName}
                                                    onChange={handleChange}
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-md"
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
                                                placeholder="9XX XXX XXXX"
                                                maxLength="12"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-md font-bold mb-4">Additional Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Pet Care Experience</label>
                                            <textarea
                                                name="petCareExperience"
                                                value={formData.petCareExperience}
                                                onChange={handleChange}
                                                placeholder="Describe your experience with pets and why you want to help with pet adoption"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-sm"
                                                rows="4"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="certifyInformation"
                                                    checked={formData.certifyInformation}
                                                    onChange={handleChange}
                                                    className="mt-1"
                                                />
                                                <span className="text-sm">
                                                    I certify that all information and documents provided are true and correct. 
                                                    I understand that providing false information may result in
                                                </span>
                                            </label>
                                            <label className="flex items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="agreeToGuidelines"
                                                    checked={formData.agreeToGuidelines}
                                                    onChange={handleChange}
                                                    className="mt-1"
                                                />
                                                <span className="text-sm">
                                                    I agree to follow FurFind's pet listing guidelines and best practices for responsible pet adoption.
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-md font-bold mb-4">Basic Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Organization Name</label>
                                            <input
                                                name="organizationName"
                                                value={formData.organizationName}
                                                onChange={handleChange}
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Registration Number</label>
                                            <input
                                                name="registrationNumber"
                                                value={formData.registrationNumber}
                                                onChange={handleChange}
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Year Established</label>
                                            <input
                                                name="yearEstablished"
                                                value={formData.yearEstablished}
                                                onChange={handleChange}
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Type of Shelter</label>
                                            <input
                                                name="shelterType"
                                                value={formData.shelterType}
                                                onChange={handleChange}
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Shelter Address</label>
                                            <input
                                                name="shelterAddress"
                                                value={formData.shelterAddress}
                                                onChange={handleChange}
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Contact Number</label>
                                            <input
                                                name="shelterContact"
                                                value={formData.shelterContact}
                                                onChange={handleChange}
                                                type="tel"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="9XX XXX XXXX"
                                                maxLength="12"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-md font-bold mb-4">Required Documents</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Registration Certificate</label>
                                            <input
                                                type="file"
                                                name="registrationCertificate"
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-ld text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-purple-600 hover:file:bg-purple-100"
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Official registration certificate of your organization
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Tax Exemption Document (if applicable)</label>
                                            <input
                                                type="file"
                                                name="taxExemption"
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-purple-600 hover:file:bg-purple-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Facility Photos</label>
                                            <input
                                                type="file"
                                                name="facilityPhotos"
                                                multiple
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-purple-600 hover:file:bg-purple-100"
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Upload at least 3 photos of your facility
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-md font-bold mb-4">Additional Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Organization Background</label>
                                            <textarea
                                                name="organizationalBackground"
                                                value={formData.organizationalBackground}
                                                onChange={handleChange}
                                                placeholder="Tell us about your organization's mission, history, and animal care practices"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-sm"
                                                rows="4"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-start gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    name="certifyInformation"
                                                    checked={formData.certifyInformation}
                                                    onChange={handleChange}
                                                    className="mt-1" 
                                                />
                                                <span className="text-sm">
                                                    I certify that all information and documents provided are true and correct. 
                                                    I understand that providing false information may result in account termination.
                                                </span>
                                            </label>
                                            <label className="flex items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="agreeToGuidelines"
                                                    checked={formData.agreeToGuidelines}
                                                    onChange={handleChange}
                                                    className="mt-1"
                                                />
                                                <span className="text-sm">
                                                    I agree to follow FurFind's pet listing guidelines and best practices for responsible pet adoption.
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 border-2 border-[#7A62DC] text-[#7A62DC] rounded-md cursor-pointer hover:bg-[#7A62DC] hover:text-white transition-colors">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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
                    Thank you for your application! Please wait for the update on your verification application.
                </p>
            </div>
        </div>
    );
};

export default VerificationApplication;
