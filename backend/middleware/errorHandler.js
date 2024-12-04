export const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size is too large. Max limit is 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    
    // Handle other errors
    res.status(500).json({
        success: false,
        message: err.message
    });
}; 