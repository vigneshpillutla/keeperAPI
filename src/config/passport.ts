import { PassportStatic, use } from 'passport';
import mongoose, { NativeError, Document, LeanDocument } from 'mongoose';
import { User, UserDocument } from '../models/user';
import localStrategy from './strategy/localStrategy';

declare global {
  namespace Express {
    interface User extends LeanDocument<UserDocument> {}
  }
}

export default function (passport: PassportStatic) {
  passport.use(localStrategy);
  // passport.use(googleStrategy);
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err: NativeError, user: UserDocument) => {
      done(err, user.toObject());
    });
  });
}
