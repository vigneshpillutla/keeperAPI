import mongoose, { Document } from 'mongoose';

interface Note {
  id: string;
  title: string;
  conetent: string;
}

interface UserNotesDocument {
  email: string;
  notes: Note[];
}

const NotesSchema = new mongoose.Schema<UserNotesDocument>({
  email: String,
  notes: [
    {
      id: String,
      title: String,
      content: String
    }
  ]
});

const UserNotes = mongoose.model<UserNotesDocument>('Notes', NotesSchema);

export { UserNotes, UserNotesDocument };
