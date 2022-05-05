import asyncHandler from 'express-async-handler';
import mongoose, { Document } from 'mongoose';
import { RequestHandler } from 'express';
import { UserNotes, UserNotesDocument } from '../models/notes';
import { sendToken } from '../utils';

const addNote: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const note = req.body;

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

export { addNote };
