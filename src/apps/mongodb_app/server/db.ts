import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

// Enable Mongoose debugging
mongoose.set('debug', true);

const connectDB = async () => {
  try {
    //await mongoose.connect('mongodb://blogUser:securePassword123@localhost:27017/blogDB?authSource=admin');
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogDB';
    await mongoose.connect(uri);
    logger.info('MongoDB Connected');
  } catch (error: any) {
    logger.error('MongoDB connection error: %s', error.message);
    process.exit(1);
  }
};

export default connectDB;
