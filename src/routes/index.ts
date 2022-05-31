import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { FailedRequest } from '../utils/error';
import { sendToken } from '../utils';
import auth from './auth';
import notes from './notes';
import users from './users';
// import socialAuth from './socialAuth';

const router = express.Router();
router.use('/api/users', users);
router.use('/api/auth', auth);
router.use('/api/notes', notes);

//   ************** Temporarily disabling OAuth ***************
// router.use('/api/oauth', socialAuth);

router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'API is running...' });
});
router.all('*', (req, res) => {
  res.status(400).json({
    success: false,
    msg: 'Invalid API end-point hit!',
    url: req.url
  });
});

router.use(
  (err: FailedRequest, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status ?? 500;
    sendToken(
      {
        success: false,
        msg: err.message
      },
      statusCode,
      res
    );
  }
);

export default router;
