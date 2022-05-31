import express from 'express';
import { ensureAuthenticated } from '../validation';
const router = express.Router();
import { getUser } from '../controllers/auth';

router.get('/', ensureAuthenticated, getUser);

export default router;
