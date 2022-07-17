import express from 'express';
import { NativeError } from 'mongoose';
import cors, { CorsOptions } from 'cors';
import session from 'express-session';
import passport from 'passport';
import sessionConfig from './config/sessions';
import dbConfig from './config/database';
import passportConfig from './config/passport';
import './models/user';
import routes from './routes';

const app = express();

/**
 * ---------Setup configs---------
 */
//Add prod and dev strings here
let whitelist = ['http://localhost:3000','https://keep-er.netlify.app'];
let corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy",1);

export default {
  app,
  build: async () => {
    // Wait for the database connection
    await dbConfig.connect();

    /**
     * --------Configuring session store ---------
     */
    const sessionOptions = await sessionConfig.connect();
    app.use(session(sessionOptions));

    /**
     * --------Configuring Passport with Local Strategy--------
     */
    passportConfig(passport);
    app.use(passport.initialize());
    app.use(passport.session());

    // Include all the routes
    app.use(routes);
  },
  cleanUp: (done: (err: NativeError) => void) => {
    dbConfig.disconnect(done);
  }
};
