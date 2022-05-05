import mongoose from 'mongoose';

const cleanDB = async () => {
  const User = mongoose.model('User');
  const UserNotes = mongoose.model('Notes');
  await User.deleteMany({});
  await UserNotes.deleteMany({});

  // Clear out sessions from connect-mongo as it does not use mongoose abstraction layer
  await mongoose.connection.db.collection('sessions').deleteMany({});
};

export { cleanDB };
