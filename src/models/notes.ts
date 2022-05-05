import mongoose from 'mongoose';

interface Note {
  id: string;
  title: string;
  conetent: string;
}

interface UserNotesDocument {
  email: string;
  notes: Note[];
}

const NotesSchema = new mongoose.Schema({
  email: String,
  notes: [
    {
      id: String,
      title: String,
      content: String
    }
  ]
});

const UserNotes = mongoose.model('Notes', NotesSchema);

export { UserNotes, UserNotesDocument };
