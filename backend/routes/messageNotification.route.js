import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    getUnreadMessageCount,
    markAllMessagesAsRead,
    getUnreadMessages
} from '../controllers/messageNotification.controller.js';

const router = express.Router();

router.get('/unread-count', verifyToken, getUnreadMessageCount);
router.post('/mark-all-read', verifyToken, markAllMessagesAsRead);
router.get('/unread', verifyToken, getUnreadMessages);

export default router;