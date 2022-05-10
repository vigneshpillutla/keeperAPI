import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import { FailedRequest } from '../utils/error';
import {
  loginSchema,
  noteSchema,
  signUpSchema,
  updateNoteSchema
} from './schemas';

const validateLogin = asyncHandler(async (req, res, next) => {
  await loginSchema.validateAsync(req.body);
  next();
});

const validateSignUp = asyncHandler(async (req, res, next) => {
  await signUpSchema.validateAsync(req.body);
  next();
});

const validateNote = asyncHandler(async (req, res, next) => {
  await noteSchema.validateAsync(req.body);

  next();
});

const validateUpdateNote = asyncHandler(async (req, res, next) => {
  await updateNoteSchema.validateAsync(req.body);

  next();
});

const ensureAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new FailedRequest('Not authorized', 401);
  }

  next();
};

export {
  validateLogin,
  validateSignUp,
  validateNote,
  validateUpdateNote,
  ensureAuthenticated
};
