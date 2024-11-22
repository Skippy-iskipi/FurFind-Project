import { AdoptionApplication } from '../models/adoptionApplication.model.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

export const submitAdoptionApplication = [
    upload.fields([
        { name: 'governmentId', maxCount: 1 },
        { name: 'proofOfResidence', maxCount: 1 },
        { name: 'proofOfIncome', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { userId, petId, ...formData } = req.body;

            if (!userId || !petId) {
                return res.status(400).json({ success: false, message: 'User ID and Pet ID are required' });
            }

            if (req.files.governmentId) {
                formData.governmentId = req.files.governmentId[0].path;
            }
            if (req.files.proofOfResidence) {
                formData.proofOfResidence = req.files.proofOfResidence[0].path;
            }
            if (req.files.proofOfIncome) {
                formData.proofOfIncome = req.files.proofOfIncome[0].path;
            }

            const adoptionApplication = new AdoptionApplication({
                userId,
                petId,
                ...formData,
            });

            await adoptionApplication.save();

            res.status(201).json({ success: true, message: 'Adoption application submitted successfully' });
        } catch (error) {
            console.error('Error saving application:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
];
