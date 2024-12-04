import React, { useState } from 'react';
import DocumentViewerModal from './DocumentViewerModal';

const VerificationReviewModal = ({ application, isOpen, onClose, onActionComplete }) => {
    const [viewingDocument, setViewingDocument] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    if (!isOpen || !application) return null;

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            
            const applicationId = application.id;
            if (!applicationId) {
                throw new Error('Application ID is missing');
            }
            
            const response = await fetch(`http://localhost:5000/api/auth/verification-applications/${applicationId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server responded with status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                alert('Application approved successfully');
                onClose();
                if (onActionComplete) onActionComplete();
            } else {
                throw new Error(data.message || 'Failed to approve application');
            }
        } catch (error) {
            console.error('Error approving application:', error);
            alert(`Error approving application: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Are you sure you want to reject this application? This action cannot be undone.')) {
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            
            const applicationId = application.id;
            if (!applicationId) {
                throw new Error('Application ID is missing');
            }
            
            const response = await fetch(`http://localhost:5000/api/auth/verification-applications/${applicationId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server responded with status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                alert('Application rejected successfully');
                onClose();
                if (onActionComplete) onActionComplete();
            } else {
                throw new Error(data.message || 'Failed to reject application');
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            alert(`Error rejecting application: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-md p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl">Verification Application</h2>
                            <p className="text-gray-600">Review the application details</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6 text-[#7A62DC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
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
                                            <span className="text-[#15803D]">View Government ID</span>
                                            <svg 
                                                className="w-5 h-5 text-[#7A62DC] group-hover:text-[#7A62DC]" 
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
                                            <span className="text-[#15803D]">View Proof of Residence</span>
                                            <svg 
                                                className="w-5 h-5 text-[#7A62DC] group-hover:text-[#7A62DC]" 
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
                            onClick={handleApprove}
                            disabled={isLoading}
                            className={`px-6 py-2 bg-[#E2F8F5] text-[#0C8577] rounded-md hover:bg-[#d0f1ed] ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={isLoading}
                            className={`px-6 py-2 bg-[#FFE7E7] text-[#E53535] rounded-md hover:bg-[#ffd4d4] ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Processing...' : 'Reject'}
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