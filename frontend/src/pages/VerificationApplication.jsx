import React, { useState } from 'react';
import axios from 'axios';

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

            console.log(response.data);
            alert('Application submitted successfully');
        } catch (error) {
            console.error(error);
            alert('Error submitting application');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Verification Application</h1>
            <p className="mb-6">Get verified to post pets for adoption on FurFind</p>
            <div className="flex justify-around mb-6">
                <button
                    onClick={() => handleTypeChange('Pet Owner')}
                    className={`px-4 py-2 border ${formType === 'Pet Owner' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
                >
                    Pet Owner
                </button>
                <button
                    onClick={() => handleTypeChange('Animal Shelter')}
                    className={`px-4 py-2 border ${formType === 'Animal Shelter' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
                >
                    Animal Shelter
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {formType === 'Pet Owner' ? (
                    <>
                        <h2 className="text-xl font-semibold">Basic Information</h2>
                        <input type="text" name="address" placeholder="Complete Address" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="occupation" placeholder="Occupation" onChange={handleChange} className="w-full p-2 border" required />

                        <h2 className="text-xl font-semibold">Emergency Contact</h2>
                        <input type="text" name="emergencyFirstName" placeholder="First Name" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="emergencyLastName" placeholder="Last Name" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="emergencyAddress" placeholder="Complete Address" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="emergencyContact" placeholder="Contact Number" onChange={handleChange} className="w-full p-2 border" required />

                        <h2 className="text-xl font-semibold">Required Documents</h2>
                        <input type="file" name="governmentId" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="file" name="proofOfResidence" onChange={handleChange} className="w-full p-2 border" required />

                        <h2 className="text-xl font-semibold">Additional Information</h2>
                        <textarea name="petCareExperience" placeholder="Pet Care Experience" onChange={handleChange} className="w-full p-2 border" required></textarea>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold">Basic Information</h2>
                        <input type="text" name="organizationName" placeholder="Organization Name" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="registrationNumber" placeholder="Registration Number" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="yearEstablished" placeholder="Year Established" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="shelterType" placeholder="Type of Shelter" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="shelterAddress" placeholder="Shelter Address" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="text" name="shelterContact" placeholder="Contact Number" onChange={handleChange} className="w-full p-2 border" required />

                        <h2 className="text-xl font-semibold">Required Documents</h2>
                        <input type="file" name="registrationCertificate" onChange={handleChange} className="w-full p-2 border" required />
                        <input type="file" name="facilityPhotos" multiple onChange={handleChange} className="w-full p-2 border" required />

                        <h2 className="text-xl font-semibold">Additional Information</h2>
                        <textarea name="organizationalBackground" placeholder="Organization Background" onChange={handleChange} className="w-full p-2 border" required></textarea>
                    </>
                )}
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input type="checkbox" name="certifyInformation" onChange={handleChange} className="mr-2" required />
                        I certify that all information and documents provided are true and correct.
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" name="agreeToGuidelines" onChange={handleChange} className="mr-2" required />
                        I agree to follow FurFind's pet listing guidelines and best practices for responsible pet adoption.
                    </label>
                </div>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default VerificationApplication;
