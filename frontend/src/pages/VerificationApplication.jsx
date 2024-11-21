import { useState } from 'react';
import InsideHeader from '../components/InsideHeader';
import InsideSidebar from '../components/InsideSidebar';

// Add this helper function outside your components
const formatPhilippineNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Ensure the number starts with 9
    if (digits.length > 0 && digits[0] !== '9') {
        return '';
    }
    
    // Format as Philippine number (9XX XXX XXXX)
    if (digits.length <= 10) {
        // Format: +63 9XX XXX XXXX
        return digits
            .slice(0, 10)
            .replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    
    return digits.slice(0, 10); // Limit to 10 digits
};

// Add this helper function outside your components
const getCurrentYear = () => {
    return new Date().getFullYear();
};

// Move PetOwnerForm outside
const PetOwnerForm = ({ formData, handleInputChange, isFormValid, handleSubmit }) => (
    <div className="grid grid-cols-2 gap-32">
        {/* Left Column */}
        <div className="space-y-12">
            <div>
                <h2 className="text-[18px] font-semibold mb-4 font-lora">Basic Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Complete Address</label>
                        <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                            rows="1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Contact Number</label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+63</span>
                            <input 
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                type="tel"
                                className="w-full p-2 pl-12 border border-gray-300 rounded-lg"
                                placeholder="9XX XXX XXXX"
                                maxLength="12" // Account for spaces
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Occupation</label>
                        <input 
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-[18px] font-semibold mb-4 font-lora">Required Documents</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Valid Government ID</label>
                        <input 
                            type="file"
                            name="governmentId"
                            onChange={handleInputChange}
                            className="w-full file:mr-4 file:py-2 file:px-4 border border-gray-300 bg-white rounded-lg
                               file:rounded-lg file:border-0 
                               file:text-sm file:font-semibold
                               file:bg-white hover:file:bg-white
                               file:text-black"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Upload a clear photo/scan of any valid government ID
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Proof of Residence</label>
                        <input 
                            type="file"
                            name="proofOfResidence"
                            onChange={handleInputChange}
                            className="w-full file:mr-4 file:py-2 file:px-4 border border-gray-300 bg-white rounded-lg
                               file:rounded-lg file:border-0 
                               file:text-sm file:font-semibold
                               file:bg-white hover:file:bg-white
                               file:text-black"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Utility bill or lease agreement from the last 1 month
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-12">
            <div>
                <h2 className="text-[18px] font-semibold mb-4 font-lora">Emergency Contact</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1 font-lora font-semibold">First Name</label>
                            <input 
                                name="emergencyFirstName"
                                value={formData.emergencyFirstName}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 font-lora font-semibold">Last Name</label>
                            <input 
                                name="emergencyLastName"
                                value={formData.emergencyLastName}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Complete Address</label>
                        <textarea 
                            name="emergencyAddress"
                            value={formData.emergencyAddress}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                            rows="1"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Contact Number</label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+63</span>
                            <input 
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleInputChange}
                                type="tel"
                                className="w-full p-2 pl-12 border border-gray-300 rounded-lg"
                                placeholder="9XX XXX XXXX"
                                maxLength="12" // Account for spaces
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-[18px] font-semibold mb-4 font-lora">Additional Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Pet Care Experience</label>
                        <textarea 
                            name="petCareExperience"
                            value={formData.petCareExperience}
                            onChange={handleInputChange}
                            placeholder="Describe your experience with pets and why you want to help with pet adoption"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                            rows="4"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-start gap-2">
                            <input 
                                type="checkbox" 
                                name="certifyInformation"
                                checked={formData.certifyInformation}
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                className="mt-1" 
                            />
                            <span className="text-sm">
                                I agree to follow FurFind's pet listing guidelines and best practices for responsible pet adoption.
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className={`py-2 px-6 border-2 rounded-lg transition-duration-200 ml-auto block
                    ${isFormValid() 
                        ? 'border-[#7A62DC] text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white' 
                        : 'border-gray-300 text-gray-300 cursor-not-allowed'}`}
            >
                Submit Application
            </button>
        </div>
    </div>
);

// Create ShelterForm component outside main component
const ShelterForm = ({ formData, handleInputChange, isFormValid, handleSubmit }) => (
    <div className="grid grid-cols-2 gap-32">
        {/* Left Column */}
        <div className="space-y-12">
            <div>
                <h2 className="text-[18px] font-semibold mb-4 font-lora">Basic Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Organization Name</label>
                        <input 
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleInputChange}
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Registration Number</label>
                        <input 
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleInputChange}
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Year Established</label>
                        <input 
                            name="yearEstablished"
                            value={formData.yearEstablished}
                            onChange={handleInputChange}
                            type="number"
                            min="1900"
                            max={getCurrentYear()}
                            className="w-full p-2 border border-gray-300 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder={`1900 - ${getCurrentYear()}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Type of Shelter</label>
                        <select 
                            name="shelterType"
                            value={formData.shelterType}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">Select type</option>
                            <option value="Non-Profit">Non-Profit</option>
                            <option value="Government">Government</option>
                            <option value="Private">Private</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Shelter Address</label>
                        <textarea 
                            name="shelterAddress"
                            value={formData.shelterAddress}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                            rows="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Contact Number</label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+63</span>
                            <input 
                                name="shelterContact"
                                value={formData.shelterContact}
                                onChange={handleInputChange}
                                type="tel"
                                className="w-full p-2 pl-12 border border-gray-300 rounded-lg"
                                placeholder="9XX XXX XXXX"
                                maxLength="12" // Account for spaces
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-12">
            <div>
                <h2 className="text-[18px] font-semibold mb-4 font-lora">Required Documents</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Registration Certificate</label>
                        <input 
                            type="file"
                            name="registrationCertificate"
                            onChange={handleInputChange}
                            className="w-full file:mr-4 file:py-2 file:px-4 border border-gray-300 bg-white rounded-lg
                               file:rounded-lg file:border-0 
                               file:text-sm file:font-semibold
                               file:bg-white hover:file:bg-white
                               file:text-black"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Official registration certificate of your organization
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Tax Exemption Document (if applicable)</label>
                        <input 
                            type="file"
                            name="taxExemption"
                            onChange={handleInputChange}
                            className="w-full file:mr-4 file:py-2 file:px-4 border border-gray-300 bg-white rounded-lg
                               file:rounded-lg file:border-0 
                               file:text-sm file:font-semibold
                               file:bg-white hover:file:bg-white
                               file:text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Facility Photos</label>
                        <input 
                            type="file"
                            name="facilityPhotos"
                            onChange={handleInputChange}
                            multiple
                            accept="image/*"
                            className="w-full file:mr-4 file:py-2 file:px-4 border border-gray-300 bg-white rounded-lg
                               file:rounded-lg file:border-0 
                               file:text-sm file:font-semibold
                               file:bg-white hover:file:bg-white
                               file:text-black"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Upload at least 3 photos of your facility at once
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-[18px] font-semibold mb-4 font-lora">Additional Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 font-lora font-semibold">Organizational Background</label>
                        <textarea 
                            name="organizationalBackground"
                            value={formData.organizationalBackground}
                            onChange={handleInputChange}
                            placeholder="Tell us about your organization's mission, history, and animal care practices"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                            rows="4"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-start gap-2">
                            <input 
                                type="checkbox" 
                                name="certifyInformation"
                                checked={formData.certifyInformation}
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                className="mt-1" 
                            />
                            <span className="text-sm">
                                I agree to follow FurFind's pet listing guidelines and best practices for responsible pet adoption.
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className={`py-2 px-6 border-2 rounded-lg transition-duration-200 ml-auto block
                    ${isFormValid() 
                        ? 'border-[#7A62DC] text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white' 
                        : 'border-gray-300 text-gray-300 cursor-not-allowed'}`}
            >
                Submit Application
            </button>
        </div>
    </div>
);

const VerificationApplication = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    const [activeButton, setActiveButton] = useState('owner');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const isFormValid = () => {
        if (activeButton === 'owner') {
            const governmentIdInput = document.querySelector('input[name="governmentId"]');
            const proofOfResidenceInput = document.querySelector('input[name="proofOfResidence"]');

            const hasRequiredFiles = 
                governmentIdInput?.files.length > 0 &&
                proofOfResidenceInput?.files.length > 0;

            const contactDigits = (formData.contactNumber || '').replace(/\s/g, '');
            const emergencyDigits = (formData.emergencyContact || '').replace(/\s/g, '');

            return (
                formData.address.trim() !== '' &&
                contactDigits.length === 10 &&
                emergencyDigits.length === 10 &&
                formData.occupation.trim() !== '' &&
                formData.emergencyFirstName.trim() !== '' &&
                formData.emergencyLastName.trim() !== '' &&
                formData.emergencyAddress.trim() !== '' &&
                formData.petCareExperience.trim() !== '' &&
                formData.certifyInformation &&
                formData.agreeToGuidelines &&
                hasRequiredFiles
            );
        } else if (activeButton === 'shelter') {
            const registrationCertificateInput = document.querySelector('input[name="registrationCertificate"]');
            const facilityPhotosInput = document.querySelector('input[name="facilityPhotos"]');

            const hasRequiredFiles = 
                registrationCertificateInput?.files.length > 0 &&
                facilityPhotosInput?.files.length >= 3;

            const shelterContactDigits = (formData.shelterContact || '').replace(/\s/g, '');

            return (
                formData.organizationName.trim() !== '' &&
                formData.registrationNumber.trim() !== '' &&
                formData.yearEstablished.trim() !== '' &&
                formData.shelterType !== '' &&
                formData.shelterAddress.trim() !== '' &&
                shelterContactDigits.length === 10 &&
                formData.organizationalBackground.trim() !== '' &&
                formData.certifyInformation &&
                formData.agreeToGuidelines &&
                hasRequiredFiles
            );
        }
        return false;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    return (
        <div className="w-full">
            <InsideHeader profileData={{ name: 'User' }} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <InsideSidebar isMenuOpen={isMenuOpen} handleLogout={() => {}} />

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Header and buttons section */}
            <div className="max-w-2xl p-10">
                <h1 className="text-[20px] text-left mb-2 font-bold">
                    Verification Application
                </h1>
                
                <p className="text-gray-600 mb-8 text-xs">
                    Get verified to post pets for adoption on FurFind
                </p>

                <h1 className="text-[14px] text-left mb-2 font-lora">
                    I am a:
                </h1>
                <div className="grid grid-cols-2 gap-6">
                    <button 
                        onClick={() => setActiveButton('owner')}
                        disabled={isSubmitted}
                        className={`py-1 px-6 border-2 rounded-lg hover:border-[#7A62DC] transition-colors
                            ${isSubmitted 
                                ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                                : activeButton === 'owner' 
                                    ? 'border-[#7A62DC] bg-[#7A62DC]' 
                                    : 'border-gray-300'}`}
                    >
                        <span className={activeButton === 'owner' ? 'text-[14px] text-white' : 'text-[14px]'}>
                            Pet Owner
                        </span>
                        <p className={`text-xs whitespace-nowrap ${
                            activeButton === 'owner' ? 'text-white' : 'text-gray-400'
                        }`}>
                            Individual wanting to rehome pets
                        </p>
                    </button> 
                    
                    <button 
                        onClick={() => setActiveButton('shelter')}
                        disabled={isSubmitted}
                        className={`py-1 px-6 border-2 rounded-lg hover:border-[#7A62DC] transition-colors
                            ${isSubmitted 
                                ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                                : activeButton === 'shelter' 
                                    ? 'border-[#7A62DC] bg-[#7A62DC]' 
                                    : 'border-gray-300'}`}
                    >
                        <span className={activeButton === 'shelter' ? 'text-[14px] text-white' : 'text-[14px]'}>
                            Shelter
                        </span>
                        <p className={`text-xs whitespace-nowrap ${
                            activeButton === 'shelter' ? 'text-white' : 'text-gray-400'
                        }`}>
                            Organization dedicated to animal welfare
                        </p>
                    </button>
                </div>
            </div>

            {isSubmitted && (
                <p className="mt-4 text-sm text-[#7A62DC]">
                    Your application has been submitted. Please wait for the update on your verification application.
                </p>
            )}

            {/* Form section */}
            {activeButton === 'owner' && (
                <div className="max-w-6xl mx-auto">
                    <div className="mt-8 p-8 rounded-lg">
                        <PetOwnerForm 
                            formData={formData}
                            handleInputChange={handleInputChange}
                            isFormValid={isFormValid}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            )}
            {activeButton === 'shelter' && (
                <div className="max-w-6xl mx-auto">
                    <div className="mt-8 p-8 rounded-lg">
                        <ShelterForm 
                            formData={formData}
                            handleInputChange={handleInputChange}
                            isFormValid={isFormValid}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            )}

            {/* Add modal at the end */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="relative bg-[#D4F5F5] p-10 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <button 
                            onClick={() => {
                                setShowModal(false);
                                setIsSubmitted(true);
                                setActiveButton(null);
                            }}
                            className="absolute top-10 right-10 font-bold text-[#7A62DC] hover:text-red-500"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col items-left text-left">
                            <img 
                                src="/applicationicon.png" 
                                alt="Application Icon" 
                                className="w-16 h-16 mb-4"
                            />
                            <h2 className="font-lora font-bold text-lg mb-2">
                                Your application has been submitted
                            </h2>
                            <p className="text-gray-600 font-semibold text-xs">
                                Thank you for your application! Please wait for the update on your verification application.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationApplication; 