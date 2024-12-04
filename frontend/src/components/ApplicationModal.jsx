import React, { useState } from 'react';
import ImageViewerModal from './ImageViewerModal';

const ApplicationModal = ({ application, isOpen, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen || !application) return null;

    const handleViewImage = (imageUrl) => {
        const filename = imageUrl.split('\\').pop();
        const fullImageUrl = `http://localhost:5000/uploads/${filename}`;
        setSelectedImage(fullImageUrl);
    };

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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                                <p className="p-2 bg-gray-50 rounded-md">{application.address}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <p className="p-2 bg-gray-50 rounded-md">{application.contactNumber}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                <p className="p-2 bg-gray-50 rounded-md">{application.occupation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Emergency Contact</h3>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <p className="p-2 bg-gray-50 rounded-md">{application.emergencyFirstName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <p className="p-2 bg-gray-50 rounded-md">{application.emergencyLastName}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                                <p className="p-2 bg-gray-50 rounded-md">{application.emergencyAddress}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <p className="p-2 bg-gray-50 rounded-md">{application.emergencyContact}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4">Required Documents</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Valid Government ID</label>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleViewImage(application.governmentId)}
                                    className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 text-left"
                                >
                                    {application.governmentId?.split('\\').pop() || 'View Document'}
                                </button>
                                <button className="p-2 text-gray-500 hover:text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Residence</label>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleViewImage(application.proofOfResidence)}
                                    className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 text-left"
                                >
                                    {application.proofOfResidence?.split('\\').pop() || 'View Document'}
                                </button>
                                <button className="p-2 text-gray-500 hover:text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4">Additional Information</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pet Care Experience</label>
                        <p className="p-4 bg-gray-50 rounded-md min-h-[100px]">{application.petCareExperience}</p>
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

                {/* Image Viewer Modal */}
                {selectedImage && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div 
                            className="relative max-w-4xl max-h-[90vh] overflow-auto bg-white p-2"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-[70]"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <img 
                                src={selectedImage} 
                                alt="Document Preview" 
                                className="max-w-full max-h-[85vh] object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationModal; 