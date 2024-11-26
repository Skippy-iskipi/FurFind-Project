import React from 'react';

const ConfirmationModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
                <p className="mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#7A62DC] text-white rounded-md hover:bg-[#6249c7]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal; 