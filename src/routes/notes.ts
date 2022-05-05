import express from 'express';
import { addNote } from '../controllers/notes';

const router = express.Router();

router.route('/').post(addNote);

export default router;
