import React, { useState } from 'react';
import DocumentViewerModal from './DocumentViewerModal';

const VerificationReviewModal = ({ application, isOpen, onClose }) => {
    const [viewingDocument, setViewingDocument] = useState(null);
    
    if (!isOpen || !application) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl">Verification Application</h2>
                            <p className="text-gray-600">Review the application details</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div>
                            <h3 className="text-xl mb-4">Basic Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2">Complete Address</label>
                                    <div className="bg-gray-50 rounded-md p-3">
                                        {application.address}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2">Contact Number</label>
                                    <div className="bg-gray-50 rounded-md p-3">
                                        {application.contactNumber}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2">Occupation</label>
                                    <div className="bg-gray-50 rounded-md p-3">
                                        {application.occupation}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl mt-8 mb-4">Required Documents</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2">Valid Government ID</label>
                                    {application.governmentId ? (
                                        <button 
                                            onClick={() => setViewingDocument({
                                                url: application.governmentId,
                                                title: 'Government ID'
                                            })}
                                            className="w-full bg-gray-50 rounded-md p-3 text-left hover:bg-gray-100 flex items-center justify-between group"
                                        >
                                            <span className="text-gray-700">View Government ID</span>
                                            <svg 
                                                className="w-5 h-5 text-gray-400 group-hover:text-gray-600" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <div className="bg-gray-50 rounded-md p-3 text-gray-500">
                                            No file uploaded
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-2">Proof of Residence</label>
                                    {application.proofOfResidence ? (
                                        <button 
                                            onClick={() => setViewingDocument({
                                                url: application.proofOfResidence,
                                                title: 'Proof of Residence'
                                            })}
                                            className="w-full bg-gray-50 rounded-md p-3 text-left hover:bg-gray-100 flex items-center justify-between group"
                                        >
                                            <span className="text-gray-700">View Proof of Residence</span>
                                            <svg 
                                                className="w-5 h-5 text-gray-400 group-hover:text-gray-600" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <div className="bg-gray-50 rounded-md p-3 text-gray-500">
                                            No file uploaded
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <h3 className="text-xl mb-4">Emergency Contact</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">First Name</label>
                                        <div className="bg-gray-50 rounded-md p-3">
                                            {application.emergencyFirstName}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2">Last Name</label>
                                        <div className="bg-gray-50 rounded-md p-3">
                                            {application.emergencyLastName}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2">Complete Address</label>
                                    <div className="bg-gray-50 rounded-md p-3">
                                        {application.emergencyAddress}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2">Contact Number</label>
                                    <div className="bg-gray-50 rounded-md p-3">
                                        {application.emergencyContact}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl mt-8 mb-4">Additional Information</h3>
                            <div>
                                <label className="block mb-2">Pet Care Experience</label>
                                <div className="bg-gray-50 rounded-md p-3 min-h-[100px]">
                                    {application.petCareExperience}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            onClick={() => onClose(true)}
                            className="px-6 py-2 bg-[#E2F8F5] text-[#0C8577] rounded-md"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => onClose(false)}
                            className="px-6 py-2 bg-[#FFE7E7] text-[#E53535] rounded-md"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>

            <DocumentViewerModal 
                isOpen={!!viewingDocument}
                onClose={() => setViewingDocument(null)}
                documentUrl={viewingDocument?.url}
                title={viewingDocument?.title}
            />
        </>
    );
};

export default VerificationReviewModal; 