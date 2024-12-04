import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import DocumentViewerModal from './DocumentViewerModal';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import RatingForm from './RatingForm';

const FormSection = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-2 gap-6">{children}</div>
    </div>
);

const ApplicationDetailsModal = ({ isOpen, onClose, application, onActionComplete }) => {
    const [activeTab, setActiveTab] = useState('Application Details');
    const [viewingDocument, setViewingDocument] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    if (!isOpen || !application) return null;
    
    const { status, pet, owner, adopter, formData, completedAt, ratings } = application;

    const handleApprove = async () => {
        try {
            if (!application) throw new Error('Application data is missing');

            const applicationId = application._id || application.id;
            if (!applicationId) throw new Error('Application ID is missing');

            setIsLoading(true);
            
            const response = await fetch(`http://localhost:5000/api/auth/adoption-requests/${applicationId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                throw new Error(data.message || `Server responded with status: ${response.status}`);
            }

            if (data.success) {
                toast.success('Application approved successfully');
                onClose();
                if (onActionComplete) onActionComplete();
            } else {
                throw new Error(data.message || 'Failed to approve application');
            }
        } catch (error) {
            console.error('Error approving application:', error);
            toast.error(error.message || 'Error approving application');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Are you sure you want to reject this application? This action cannot be undone.')) {
            return;
        }

        try {
            if (!application) throw new Error('Application data is missing');

            const applicationId = application._id || application.id;
            if (!applicationId) throw new Error('Application ID is missing');

            setIsLoading(true);
            
            const response = await fetch(`http://localhost:5000/api/auth/adoption-requests/${applicationId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                throw new Error(data.message || `Server responded with status: ${response.status}`);
            }

            if (data.success) {
                toast.success('Application rejected successfully');
                onClose();
                if (onActionComplete) onActionComplete();
            } else {
                throw new Error(data.message || 'Failed to reject application');
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error(error.message || 'Error rejecting application');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = async () => {
        try {
            if (!application) throw new Error('Application data is missing');

            const applicationId = application._id || application.id;
            if (!applicationId) throw new Error('Application ID is missing');

            setIsLoading(true);
            
            const response = await fetch(`http://localhost:5000/api/auth/adoption-requests/${applicationId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                throw new Error(data.message || `Server responded with status: ${response.status}`);
            }

            if (data.success) {
                toast.success('Adoption process marked as completed');
                onClose();
                if (onActionComplete) onActionComplete();
            } else {
                throw new Error(data.message || 'Failed to complete adoption process');
            }
        } catch (error) {
            console.error('Error completing adoption process:', error);
            toast.error(error.message || 'Error completing adoption process');
            if (error.message.includes('log in again')) {
                window.location.href = '/login';
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRatingSubmit = async (ratingData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/ratings/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    applicationId: application._id || application.id,
                    feedback: ratingData.feedback,
                    stars: ratingData.stars
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit rating');
            }

            toast.success('Rating submitted successfully');
            setIsRatingModalOpen(false);
            if (onActionComplete) onActionComplete();
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error(error.message || 'Error submitting rating');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex space-x-4">
                        <button
                            className={`px-4 py-2 ${
                                activeTab === 'Application Details'
                                    ? 'text-[#7A62DC] border-b-2 border-[#7A62DC]'
                                    : 'text-gray-500'
                            }`}
                            onClick={() => setActiveTab('Application Details')}
                        >
                            Application Details
                        </button>
                        <button
                            className={`px-4 py-2 ${
                                activeTab === 'Adoption Form'
                                    ? 'text-[#7A62DC] border-b-2 border-[#7A62DC]'
                                    : 'text-gray-500'
                            }`}
                            onClick={() => setActiveTab('Adoption Form')}
                        >
                            Adoption Form
                        </button>
                    </div>
                    <button onClick={onClose} className="px-2 py-1 text-[#7A62DC] rounded-md hover:bg-[#7A62DC] hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'Application Details' && (
                        <div className="space-y-6">
                            <div className="flex space-x-6">
                                <div className="w-1/3">
                                    <img
                                        src={pet?.image}
                                        alt={pet?.name}
                                        className="w-full h-64 object-cover rounded-md"
                                    />
                                </div>
                                <div className="w-2/3 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <h2 className="text-2xl font-semibold">Application Status</h2>
                                        </div>
                                        <span className={`px-3 py-1 rounded-md text-sm ${
                                            status === 'Pending'
                                                ? 'bg-[#FEF9C3] text-[#A16207]'
                                                : status === 'Approved'
                                                ? 'bg-[#CFFAFE] text-[#0E7490]'
                                                : status === 'Completed'
                                                ? 'bg-[#DCFCE7] text-[#15803D]'
                                                : 'bg-[#FEE2E2] text-[#B91C1C]'
                                        }`}>
                                            {status}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        {status === 'Completed' && completedAt && (
                                            <p className="text-sm font-medium text-[#15803D]">
                                                Completed on {new Date(completedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex gap-2">
                                            <p className="text-gray-600">Name:</p>
                                            <p className="font-medium">{pet?.name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-gray-600">Classification:</p>
                                            <p className="font-medium">{pet?.classification}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-gray-600">Breed:</p>
                                            <p className="font-medium">{pet?.breed}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-gray-600">Gender:</p>
                                            <p className="font-medium">{pet?.gender}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-gray-600">Age:</p>
                                            <p className="font-medium">{pet?.age}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-gray-600">Location:</p>
                                            <p className="font-medium">{pet?.location}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-gray-600">Ratings:</p>
                                            {status === 'Completed' ? (
                                                ratings && ratings.length > 0 ? (
                                                    <button
                                                        onClick={() => setIsRatingModalOpen(true)}
                                                        className="text-[#7A62DC] underline"
                                                    >
                                                        View Ratings
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsRatingModalOpen(true)}
                                                        className="text-[#7A62DC] underline"
                                                    >
                                                        Rate
                                                    </button>
                                                )
                                            ) : (
                                                <span className="text-gray-500">Available after completion</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-md font-semibold mb-4 text-left">Adopter</h3>
                                    <div className="space-y-2 text-left">
                                        <p className="text-gray-600 text-md font-medium"><span className="text-[#7A62DC]">{adopter?.name}</span></p>
                                        <p className="text-gray-600 flex items-center">
                                            <PhoneIcon className="h-5 w-5 text-[#7A62DC] inline mr-2" />
                                            <span className="text-black">{formData?.contactNumber}</span>
                                        </p>
                                        <p className="text-gray-600 flex items-center">
                                            <EnvelopeIcon className="h-5 w-5 text-[#7A62DC] inline mr-2" />
                                            <span className="text-black">{adopter?.email}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-md font-semibold mb-4 text-left">
                                        {owner?.role === 'Animal Shelter' ? 'Animal Shelter' : 'Pet Owner'}
                                    </h3>
                                    <div className="space-y-2 text-left">
                                        <p className="text-gray-600 text-md font-medium"><span className="text-[#7A62DC]">
                                            {owner?.name}
                                        </span></p>
                                        <p className="text-gray-600 flex items-center">
                                            <PhoneIcon className="h-5 w-5 text-[#7A62DC] inline mr-2" />
                                            <span className="text-black">{owner?.contactNumber || 'Not available'}</span>
                                        </p>
                                        <p className="text-gray-600 flex items-center">
                                            <EnvelopeIcon className="h-5 w-5 text-[#7A62DC] inline mr-2" />
                                            <span className="text-black">{owner?.email}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Adoption Form' && (
                        <div className="space-y-8 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8 text-left">Adoption Application Form</h2>
                            
                            <div className="grid grid-cols-2 gap-12 text-left">
                                {/* Left Column */}
                                <div>
                                    {/* Basic Information */}
                                    <div className="mb-8">
                                        <div className="space-y-4">
                                            <p className="text-xl font-semibold mb-4">Basic Information</p>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.address}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.contactNumber}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.occupation}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pet Care Information */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Pet Care Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Residence</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.typeOfResidence}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Do you own or rent?</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.residenceOwnership}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Have you had pets before?</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.hadPetsBefore}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Do you have other pets currently?</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.hasCurrentPets}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">How will you care for the pet?</label>
                                                <p className="p-2 bg-gray-50 rounded-md min-h-[100px]">{formData?.petCareDescription}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div>
                                    {/* Emergency Contact */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                    <p className="p-2 bg-gray-50 rounded-md">{formData?.emergencyFirstName}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                    <p className="p-2 bg-gray-50 rounded-md">{formData?.emergencyLastName}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.emergencyAddress}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                                <p className="p-2 bg-gray-50 rounded-md">{formData?.emergencyContact}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Required Documents */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Required Documents</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block mb-2">Valid Government ID</label>
                                                {formData?.governmentId ? (
                                                    <button 
                                                        onClick={() => setViewingDocument({
                                                            url: formData.governmentId,
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
                                                {formData?.proofOfResidence ? (
                                                    <button 
                                                        onClick={() => setViewingDocument({
                                                            url: formData.proofOfResidence,
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

                                            <div>
                                                <label className="block mb-2">Proof of Income</label>
                                                {formData?.proofOfIncome ? (
                                                    <button 
                                                        onClick={() => setViewingDocument({
                                                            url: formData.proofOfIncome,
                                                            title: 'Proof of Income'
                                                        })}
                                                        className="w-full bg-gray-50 rounded-md p-3 text-left hover:bg-gray-100 flex items-center justify-between group"
                                                    >
                                                        <span className="text-[#15803D]">View Proof of Income</span>
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
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t p-4 flex justify-end space-x-4">
                    {application.status === 'Approved' ? (
                        <button
                            onClick={handleComplete}
                            disabled={isLoading}
                            className="px-6 py-2 border border-[#DCFCE7] bg-white text-[#16A34A] rounded-md hover:bg-[#15803D] hover:text-[#DCFCE7] transition-colors"
                        >
                            {isLoading ? 'Processing...' : 'Complete Adoption'}
                        </button>
                    ) : application.status !== 'Completed' && (
                        <>
                            <button
                                onClick={handleApprove}
                                disabled={application.status === 'Rejected' || isLoading}
                                className={`px-6 py-2 border border-[#DCFCE7] text-[#16A34A] rounded-md ${
                                    application.status === 'Rejected' || isLoading
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-[#15803D] hover:text-[#DCFCE7] transition-colors'
                                }`}
                            >
                                {isLoading ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={application.status === 'Rejected' || isLoading}
                                className={`px-6 py-2 border border-[#FEE2E2] text-[#B91C1C] rounded-md ${
                                    application.status === 'Rejected' || isLoading
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-[#B91C1C] hover:text-[#FEE2E2] transition-colors'
                                }`}
                            >
                                {isLoading ? 'Processing...' : 'Reject'}
                            </button>
                        </>
                    )}
                </div>
            </div>
            {isRatingModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-6 max-w-md w-full">
                        {ratings && ratings.length > 0 ? (
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Ratings and Feedback</h3>
                                {ratings.map((rating, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="font-medium">Stars: {rating.stars}</p>
                                        <p className="text-gray-600">Feedback: {rating.feedback}</p>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setIsRatingModalOpen(false)}
                                    className="mt-4 px-4 py-2 bg-[#7A62DC] text-white rounded-md"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <RatingForm
                                onSubmit={handleRatingSubmit}
                                onCancel={() => setIsRatingModalOpen(false)}
                            />
                        )}
                    </div>
                </div>
            )}
            <DocumentViewerModal 
                isOpen={!!viewingDocument}
                onClose={() => setViewingDocument(null)}
                documentUrl={viewingDocument?.url}
                title={viewingDocument?.title}
            />
        </div>
    );
};

export default ApplicationDetailsModal;