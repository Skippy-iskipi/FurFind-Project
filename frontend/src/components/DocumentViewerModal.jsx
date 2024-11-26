import { useState } from 'react';

const DocumentViewerModal = ({ isOpen, onClose, documentUrl, title }) => {
    const [isLoading, setIsLoading] = useState(true);
    
    if (!isOpen) return null;

    const filename = documentUrl.split('\\').pop();
    const fileExtension = filename.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    const isDoc = ['doc', 'docx'].includes(fileExtension);

    const fullUrl = `http://localhost:5000/uploads/${filename}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-md p-6 w-full max-w-4xl max-h-[90vh] relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="h-[70vh] w-full flex items-center justify-center bg-gray-100 rounded-md">
                    {isLoading && (
                        <div className="text-gray-500">Loading...</div>
                    )}
                    
                    {isImage && (
                        <img
                            src={fullUrl}
                            alt={title}
                            className="max-h-full max-w-full object-contain"
                            onLoad={() => setIsLoading(false)}
                            style={isLoading ? { display: 'none' } : {}}
                            onError={(e) => {
                                console.error('Image failed to load:', fullUrl);
                                setIsLoading(false);
                            }}
                        />
                    )}
                    
                    {isPDF && (
                        <iframe
                            src={fullUrl}
                            className="w-full h-full border-0"
                            title={title}
                            onLoad={() => setIsLoading(false)}
                            style={isLoading ? { display: 'none' } : {}}
                        />
                    )}
                    
                    {isDoc && (
                        <div className="text-center p-4">
                            <p className="mb-4">This document type cannot be previewed.</p>
                            <a 
                                href={fullUrl}
                                download
                                className="px-4 py-2 bg-[#7A62DC] text-white rounded-md hover:bg-[#6952bd]"
                            >
                                Download Document
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentViewerModal; 