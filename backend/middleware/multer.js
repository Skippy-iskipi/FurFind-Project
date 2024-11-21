import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images, PDFs, and DOC files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/i)) {
        req.fileValidationError = 'Only image, PDF, and DOC files are allowed!';
        return cb(new Error('Only image, PDF, and DOC files are allowed!'), false);
    }
    cb(null, true);
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});
