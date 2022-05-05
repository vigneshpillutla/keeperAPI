import asyncHandler from 'express-async-handler';
import mongoose, { Document } from 'mongoose';
import { RequestHandler } from 'express';
import { UserNotes, UserNotesDocument } from '../models/notes';
import { sendToken } from '../utils';
import { v4 as uuidv4 } from 'uuid';

const addNote: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const note = req.body;
  note.id = uuidv4();

  let userNotes: UserNotesDocument & Document = await UserNotes.findOne({
    email
  });

  if (!userNotes) {
    userNotes = new UserNotes({
      email,
      notes: []
    });
  }

  userNotes.notes.push(note);
  await userNotes.save();

  sendToken(
    {
      success: true,
      data: note
    },
    200,
    res
  );
});

const getNotes: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const userNotes = await UserNotes.findOne({ email }).lean();

  sendToken(
    {
      success: true,
      data: userNotes.notes
    },
    200,
    res
  );
});

export { addNote, getNotes };
