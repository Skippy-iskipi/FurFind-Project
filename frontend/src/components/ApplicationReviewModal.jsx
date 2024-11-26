import React from 'react';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';

const ApplicationReviewModal = ({ application, isOpen, onClose }) => {
    if (!isOpen || !application) return null;

    const handleApprove = () => {
        // Handle approval logic here
        toast.success('Application approved!');
        onClose();
    };

    const handleReject = () => {
        // Handle rejection logic here
        toast.error('Application rejected!');
        onClose();
    };

    const renderPetOwnerDetails = () => (
        <div className="space-y-4">
            <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Application ID</h4>
                <p className="text-gray-700">{application._id}</p>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <div className="space-y-2">
                    <p><span className="font-medium">Address:</span> {application.formData?.address}</p>
                    <p><span className="font-medium">Contact Number:</span> {application.formData?.contactNumber}</p>
                    <p><span className="font-medium">Occupation:</span> {application.formData?.occupation}</p>
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Emergency Contact</h4>
                <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {application.formData?.emergencyFirstName} {application.formData?.emergencyLastName}</p>
                    <p><span className="font-medium">Address:</span> {application.formData?.emergencyAddress}</p>
                    <p><span className="font-medium">Contact:</span> {application.formData?.emergencyContact}</p>
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Supporting Documents</h4>
                <div className="space-y-2">
                    <div className="bg-gray-100 p-4 rounded">
                        <p><span className="font-medium">Government ID:</span></p>
                        <img src={application.formData?.governmentId} alt="Government ID" className="max-w-md mt-2" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded">
                        <p><span className="font-medium">Proof of Residence:</span></p>
                        <img src={application.formData?.proofOfResidence} alt="Proof of Residence" className="max-w-md mt-2" />
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Additional Information</h4>
                <div className="space-y-2">
                    <p><span className="font-medium">Pet Care Experience:</span> {application.formData?.petCareExperience}</p>
                    <p><span className="font-medium">Submitted At:</span> {new Date(application.submittedAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );

    const renderShelterDetails = () => (
        <div>
            <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Basic Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                            <p className="p-2 bg-gray-50 rounded-md">{application.organizationName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                            <p className="p-2 bg-gray-50 rounded-md">{application.registrationNumber}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                            <p className="p-2 bg-gray-50 rounded-md">{application.yearEstablished}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Shelter</label>
                            <p className="p-2 bg-gray-50 rounded-md">{application.typeOfShelter}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shelter Address</label>
                            <p className="p-2 bg-gray-50 rounded-md">{application.shelterAddress}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <p className="p-2 bg-gray-50 rounded-md">{application.contactNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Required Documents</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Certificate</label>
                            <p className="p-2 bg-gray-50 rounded-md">{application.registrationCertificate || 'No file chosen'}</p>
                            <p className="text-gray-500 text-sm">Official registration certificate of your organization</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Exemption Document</label>
                            <p className="p-2 bg-gray-50 rounded-md">{application.taxExemptionDocument || 'No file chosen'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facility Photos</label>
                            <p className="p-2 bg-gray-50 rounded-md">
                                {application.facilityPhotos?.length > 0 ? `${application.facilityPhotos.length} files selected` : 'No files chosen'}
                            </p>
                            <p className="text-gray-500 text-sm">Upload at least 3 photos of your facility</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Additional Information</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Background</label>
                    <p className="p-4 bg-gray-50 rounded-md min-h-[100px]">{application.organizationBackground || 'No information provided'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">
                        {application.type === 'Animal Shelter' ? 'Shelter Application Review' : 'Pet Owner Verification Review'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {application.type === 'Animal Shelter' ? renderShelterDetails() : renderPetOwnerDetails()}

                <div className="flex justify-end space-x-4 mt-6">
                    <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50" onClick={handleReject}>
                        Reject Application
                    </button>
                    <button className="px-4 py-2 bg-[#7A62DC] text-white rounded-md hover:bg-[#6249c7]" onClick={handleApprove}>
                        Approve Application
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationReviewModal;