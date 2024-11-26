import React, { useState, useEffect } from 'react';

const VerificationReviewModal = ({ isOpen, onClose, applicationId }) => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            if (!applicationId) return;
            
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching application:', applicationId);

                const response = await fetch(`http://localhost:5000/api/auth/verification-applications/${applicationId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('Response data:', data);

                if (data.success) {
                    setApplication(data.application);
                } else {
                    console.error('Failed to fetch application details:', data.message);
                }
            } catch (error) {
                console.error('Error fetching application details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && applicationId) {
            setLoading(true);
            fetchApplicationDetails();
        }
    }, [applicationId, isOpen]);

    const handleApprove = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/auth/verification-applications/${applicationId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            if (data.success) {
                toast.success('Application approved successfully');
                onClose(true);
            } else {
                toast.error('Failed to approve application');
            }
        } catch (error) {
            console.error('Error approving application:', error);
            toast.error('Failed to approve application');
        }
    };

    const handleReject = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/auth/verification-applications/${applicationId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            if (data.success) {
                toast.success('Application rejected successfully');
                onClose(true);
            } else {
                toast.error('Failed to reject application');
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error('Failed to reject application');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Verification Application Review</h2>
                    <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A62DC]"></div>
                    </div>
                ) : application ? (
                    <div className="space-y-4">
                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Application ID</h4>
                            <p className="text-gray-700">{application._id}</p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Verification Type</h4>
                            <p className="text-gray-700">{application.type}</p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Personal Information</h4>
                            <div className="space-y-2">
                                <p><span className="font-medium">Address:</span> {application.formData.address}</p>
                                <p><span className="font-medium">Contact Number:</span> {application.formData.contactNumber}</p>
                                <p><span className="font-medium">Occupation:</span> {application.formData.occupation}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Emergency Contact</h4>
                            <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {application.formData.emergencyFirstName} {application.formData.emergencyLastName}</p>
                                <p><span className="font-medium">Address:</span> {application.formData.emergencyAddress}</p>
                                <p><span className="font-medium">Contact:</span> {application.formData.emergencyContact}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Supporting Documents</h4>
                            <div className="space-y-2">
                                <div className="bg-gray-100 p-4 rounded">
                                    <p><span className="font-medium">Government ID:</span></p>
                                    <img 
                                        src={application.formData.governmentId} 
                                        alt="Government ID" 
                                        className="max-w-md mt-2"
                                    />
                                </div>
                                <div className="bg-gray-100 p-4 rounded">
                                    <p><span className="font-medium">Proof of Residence:</span></p>
                                    <img 
                                        src={application.formData.proofOfResidence} 
                                        alt="Proof of Residence" 
                                        className="max-w-md mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Additional Information</h4>
                            <div className="space-y-2">
                                <p><span className="font-medium">Pet Care Experience:</span> {application.formData.petCareExperience}</p>
                                <p><span className="font-medium">Submitted At:</span> {new Date(application.submittedAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                            >
                                Reject
                            </button>
                            <button
                                onClick={handleApprove}
                                className="px-4 py-2 bg-[#7A62DC] text-white rounded-md hover:bg-[#6249c7]"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Application not found</p>
                )}
            </div>
        </div>
    );
};

export default VerificationReviewModal; 