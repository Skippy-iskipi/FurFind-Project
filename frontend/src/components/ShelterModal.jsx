import React from 'react';

const ShelterModal = ({ application, isOpen, onClose }) => {
    if (!isOpen || !application) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-10 w-[1000px] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Verification Application</h2>
                        <p className="text-gray-500 text-sm">Review the application details</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-[#7A62DC] hover:text-[#7A62DE]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Exemption Document (if applicable)</label>
                                <p className="p-2 bg-gray-50 rounded-md">{application.taxExemptionDocument || 'No file chosen'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facility Photos</label>
                                <p className="p-2 bg-gray-50 rounded-md">{application.facilityPhotos?.length > 0 ? `${application.facilityPhotos.length} files selected` : 'No files chosen'}</p>
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

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                    <button 
                        className="px-6 py-2 bg-[#E2F8F5] text-[#0C8577] rounded-md hover:bg-[#d0f1ed]"
                    >
                        Approve
                    </button>
                    <button 
                        className="px-6 py-2 bg-[#FFE7E7] text-[#E53535] rounded-md hover:bg-[#ffd4d4]"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShelterModal; 