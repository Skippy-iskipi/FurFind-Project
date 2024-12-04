import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';

import { fileURLToPath } from 'url';

import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import verificationApplicationRoutes from './routes/verificationApplication.routes.js';
import adoptionApplicationRoutes from './routes/adoptionApplication.routes.js';
import messageNotificationRoutes from './routes/messageNotification.route.js';

import { upload } from './middleware/multer.js';
import passport from 'passport';
import session from 'express-session';
import './middleware/passport-setup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use('/api/verification', verificationApplicationRoutes);
app.use('/api/adoption', adoptionApplicationRoutes);
app.use('/api/message-notifications', messageNotificationRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/upload', upload.single('file'), (req, res) => {
    // Handle the file upload
    res.send('File uploaded successfully');
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});