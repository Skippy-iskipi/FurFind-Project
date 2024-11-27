// ApplicationDetailsModal.jsx

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import DocumentViewerModal from './DocumentViewerModal';

const FormSection = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-2 gap-6">{children}</div>
    </div>
);

const ApplicationDetailsModal = ({ isOpen, onClose, application }) => {
    const [activeTab, setActiveTab] = useState('Application Details');
    const [viewingDocument, setViewingDocument] = useState(null);

    if (!isOpen || !application) return null;
    
    const { status, pet, owner, adopter, formData } = application;

    const handleApprove = async () => {
        try {
            // Add your approve logic here
            toast.success('Application approved successfully');
            onClose();
        } catch (error) {
            console.error('Error approving application:', error);
            toast.error('Failed to approve application');
        }
    };

    const handleReject = async () => {
        try {
            // Add your reject logic here
            toast.success('Application rejected successfully');
            onClose();
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error('Failed to reject application');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                                <div className="w-2/3 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-semibold">Application Status</h2>
                                        <span className={`px-3 py-1 rounded-md text-sm ${
                                            status === 'Pending'
                                                ? 'bg-[#FEF9C3] text-[#A16207]'
                                                : status === 'Approved'
                                                ? 'bg-[#CFFAFE] text-[#0E7490]'
                                                : 'bg-[#FEE2E2] text-[#B91C1C]'
                                        }`}>
                                            {status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">Name:</p>
                                            <p className="font-medium">{pet?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Classification:</p>
                                            <p className="font-medium">{pet?.classification}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Breed:</p>
                                            <p className="font-medium">{pet?.breed}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Gender:</p>
                                            <p className="font-medium">{pet?.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Age:</p>
                                            <p className="font-medium">{pet?.age}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Location:</p>
                                            <p className="font-medium">{pet?.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">Adopter</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-600">Name: <span className="text-black">{adopter?.name}</span></p>
                                        <p className="text-gray-600">Contact: <span className="text-black">{formData?.contactNumber}</span></p>
                                        <p className="text-gray-600">Email: <span className="text-black">{adopter?.email}</span></p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">
                                        {owner?.role === 'Animal Shelter' ? 'Animal Shelter' : 'Pet Owner'}
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-600">Name: <span className="text-black">
                                            {owner?.name}
                                        </span></p>
                                        <p className="text-gray-600">Contact: <span className="text-black">
                                            {owner?.contactNumber || 'Not available'}
                                        </span></p>
                                        <p className="text-gray-600">Email: <span className="text-black">
                                            {owner?.email}
                                        </span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Adoption Form' && (
                        <div className="space-y-8 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8">Adoption Application Form</h2>
                            
                            <div className="grid grid-cols-2 gap-12">
                                {/* Left Column */}
                                <div>
                                    {/* Basic Information */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                                        <div className="space-y-4">
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
                    <button
                        onClick={handleApprove}
                        className="px-6 py-2 bg-[#22C55E] text-white rounded-md hover:bg-[#16A34A] transition-colors"
                    >
                        Approve
                    </button>
                    <button
                        onClick={handleReject}
                        className="px-6 py-2 bg-[#EF4444] text-white rounded-md hover:bg-[#DC2626] transition-colors"
                    >
                        Reject
                    </button>
                </div>
            </div>

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