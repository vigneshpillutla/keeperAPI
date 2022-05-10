import express from 'express';
import passport from 'passport';
import {
  ensureAuthenticated,
  validateNote,
  validateUpdateNote
} from '../validation';
import { addNote, getNotes, updateNote } from '../controllers/notes';

const router = express.Router();

router.use(ensureAuthenticated);

router.route('/').get(getNotes).post(validateNote, addNote);

router.patch('/:id', validateUpdateNote, updateNote);

export default router;
