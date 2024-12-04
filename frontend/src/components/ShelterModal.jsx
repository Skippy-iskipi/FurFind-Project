import React, { useState } from 'react';
import DocumentViewerModal from './DocumentViewerModal';

const ShelterModal = ({ application, isOpen, onClose, onActionComplete }) => {
    const [viewingDocument, setViewingDocument] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    
    if (!isOpen || !application) return null;

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            
            // Check if application exists and has an id
            if (!application) {
                throw new Error('No application data available');
            }

            // Use application.id instead of application._id
            const applicationId = application.id;
            console.log('Application ID:', applicationId);
            
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
            
            // Use application.id instead of application._id
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
                <div className="bg-white rounded-md p-10 w-[1000px] max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">Verification Application</h2>
                            <p className="text-gray-500 text-sm">Review the application details</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-[#7A62DC] hover:text-[#7A62DC]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div>
                            <h3 className="text-md font-bold mb-4">Basic Information</h3>
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
                                    <p className="p-2 bg-gray-50 rounded-md">{application.type}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shelter Address</label>
                                    <p className="p-2 bg-gray-50 rounded-md">{application.shelterAddress}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <p className="p-2 bg-gray-50 rounded-md">{application.shelterContact}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <h3 className="text-md font-bold mb-4">Required Documents</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Certificate</label>
                                    {application.registrationCertificate ? (
                                        <button 
                                            onClick={() => setViewingDocument({
                                                url: application.registrationCertificate,
                                                title: 'Registration Certificate'
                                            })}
                                            className="w-full bg-gray-50 rounded-md p-3 text-left hover:bg-gray-100 flex items-center justify-between group"
                                        >
                                            <span className="text-gray-700">View Certificate</span>
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
                                        <p className="p-2 bg-gray-50 rounded-md">No file uploaded</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Exemption Document</label>
                                    {application.taxExemptionDocument ? (
                                        <button 
                                            onClick={() => setViewingDocument({
                                                url: application.taxExemptionDocument,
                                                title: 'Tax Exemption Document'
                                            })}
                                            className="w-full bg-gray-50 rounded-md p-3 text-left hover:bg-gray-100 flex items-center justify-between group"
                                        >
                                            <span className="text-gray-700">View Document</span>
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
                                        <p className="p-2 bg-gray-50 rounded-md">No file uploaded</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Facility Photos</label>
                                    {application.facilityPhotos?.length > 0 ? (
                                        <div className="space-y-2">
                                            {application.facilityPhotos.map((photo, index) => (
                                                <button 
                                                    key={index}
                                                    onClick={() => setViewingDocument({
                                                        url: photo,
                                                        title: `Facility Photo ${index + 1}`
                                                    })}
                                                    className="w-full bg-gray-50 rounded-md p-3 text-left hover:bg-gray-100 flex items-center justify-between group"
                                                >
                                                    <span className="text-gray-700">View Photo {index + 1}</span>
                                                    <svg 
                                                        className="w-5 h-5 text-[#7A62DC] group-hover:text-[#7A62DC]" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="p-2 bg-gray-50 rounded-md">No files uploaded</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8">
                        <h3 className="text-md font-bold mb-4">Additional Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Background</label>
                            <p className="p-4 bg-gray-50 rounded-md min-h-[100px]">
                                {application.organizationalBackground || 'No information provided'}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button 
                            onClick={handleApprove}
                            className="px-6 py-2 bg-[#E2F8F5] text-[#0C8577] rounded-md hover:bg-[#d0f1ed]"
                        >
                            Approve
                        </button>
                        <button 
                            onClick={handleReject}
                            className="px-6 py-2 bg-[#FFE7E7] text-[#E53535] rounded-md hover:bg-[#ffd4d4]"
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

export default ShelterModal; 