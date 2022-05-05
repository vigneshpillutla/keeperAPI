import express from 'express';
import passport from 'passport';
import { ensureAuthenticated, validateNote } from '../validation';
import { addNote, getNotes } from '../controllers/notes';

const router = express.Router();

router.use(ensureAuthenticated);

router.route('/').get(getNotes).post(validateNote, addNote);

export default router;
