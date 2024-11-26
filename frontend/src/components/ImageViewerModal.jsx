const ImageViewerModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    console.log('Rendering ImageViewerModal with URL:', imageUrl);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
            onClick={onClose}
        >
            <div 
                className="relative max-w-4xl max-h-[90vh] overflow-auto"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 z-[70]"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img 
                    src={imageUrl} 
                    alt="Document Preview" 
                    className="max-w-full max-h-[90vh] object-contain"
                    onError={(e) => {
                        console.error('Image failed to load:', e);
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />
            </div>
        </div>
    );
};

export default ImageViewerModal; 