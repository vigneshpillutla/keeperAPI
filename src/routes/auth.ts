import express from 'express';
import passport from 'passport';
const router = express.Router();
import {
  loginUser,
  signUpUser,
  logoutUser,
  secret,
  getUser,
  passportAuthenticateLocal
} from '../controllers/auth';
import { ensureAuthenticated, validateLogin, validateSignUp } from '../validation';

router.post('/login', validateLogin, passportAuthenticateLocal, loginUser);

router.post('/signUp', validateSignUp, signUpUser);

router.get('/user', ensureAuthenticated ,getUser);

router.get('/logout', logoutUser);

router.get('/secret', secret);

export default router;
