import asyncHandler from 'express-async-handler';
import mongoose, { Document } from 'mongoose';
import { RequestHandler } from 'express';
import { UserNotes, UserNotesDocument } from '../models/notes';
import { sendToken } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { FailedRequest } from '../utils/error';
import _ from 'lodash';

const addNote: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const note = req.body;
  note.id = uuidv4();

  let userNotes = await UserNotes.findOne({
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
      data: userNotes?.notes ?? []
    },
    200,
    res
  );
});

// Handler to update a note based on an id
const updateNote: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const noteId = req.params.id;

  const filter = {
    email,
    'notes.id': noteId
  };
  const update: {
    [key: string]: unknown;
  } = {};

  Object.entries(req.body).forEach(
    ([key, value]) => (update[`notes.$.${key}`] = value)
  );

  const noteExists = await UserNotes.exists(filter);

  if (!noteExists) {
    throw new FailedRequest('Note not found', 403);
  }

  const newDoc = await UserNotes.findOneAndUpdate(filter, update, {
    new: true
  }).lean();

  // Find the new modified note and send it in the response
  const newNote = newDoc.notes.find((note) => note.id === noteId);

  sendToken(
    {
      success: true,
      data: _.omit(newNote, '_id')
    },
    200,
    res
  );
});

const deleteNote:RequestHandler = asyncHandler(async (req,res) => {
  const { email } = req.user;
  const noteId = req.params.id;

  const filter = {
    email
  };


  await UserNotes.updateOne(filter,{
    $pull:{
      notes:{id:noteId}
    }
  })

  sendToken({success:true,msg:"Successfully deleted!"},201,res);
})

export { addNote, getNotes, updateNote, deleteNote };
