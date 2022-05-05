import mongoose from 'mongoose';

interface Note {
  id: number;
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
      id: Number,
      title: String,
      content: String
    }
  ]
});

const UserNotes = mongoose.model('Notes', NotesSchema);

export { UserNotes, UserNotesDocument };
