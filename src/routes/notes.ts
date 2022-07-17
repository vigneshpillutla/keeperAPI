import express from 'express';
import {
  ensureAuthenticated,
  validateNote,
  validateUpdateNote
} from '../validation';
import { addNote, getNotes, updateNote,deleteNote } from '../controllers/notes';

const router = express.Router();

router.use(ensureAuthenticated);

router.route('/').get(getNotes).post(validateNote, addNote);

router.route('/:id').patch( validateUpdateNote, updateNote).delete(deleteNote);

export default router;
