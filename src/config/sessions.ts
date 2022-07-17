import connectMongo from 'connect-mongo';
import { CookieOptions, SessionOptions } from 'express-session';
import { SESSION_SECRET } from '../utils/secrets';
import dbConfig from './database';

const { connect: connectDB } = dbConfig;
const { create } = connectMongo;

const sessionConfig = {
  connect: async () => {
    const sessionStore = create({
      collectionName: 'sessions',
      clientPromise: connectDB().then((m) => m.connection.getClient())
    });
    const cookie:CookieOptions = {
      
        // 1 week
        maxAge: 604800000,
        secure:true,
        sameSite:'none'
      
    }
    const sessionOptions:SessionOptions = {
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie
    }
    return sessionOptions;
  }
};

export default sessionConfig;
