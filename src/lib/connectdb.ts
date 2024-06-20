import mongoose from 'mongoose';

let isConnected = false;

const db_uri = process.env.DB_URI;
const db_name = process.env.DB_NAME;

export const connectdb = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('DB is already connected!');
    return;
  }

  try {
    await mongoose.connect(db_uri!, {
      dbName: db_name,
    });
  } catch (error) {
    console.log(error);
  }
};
