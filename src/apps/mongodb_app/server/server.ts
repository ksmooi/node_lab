// npx ts-node src/apps/mongodb_app/server/server.ts

// create file `APP_HOME/.env`
//   MONGODB_URI=mongodb://blogUser:securePassword123@localhost:27017/blogDB?authSource=admin
//   MONGODB_APP_SERVER_PORT=5000

import express from 'express';
import connectDB from './db';
import postRoutes from './postRoutes';
import errorHandler from './errorHandler';
import morgan from 'morgan'; // For HTTP request logging

const app = express();
const PORT = process.env.MONGODB_APP_SERVER_PORT || 5000;

// Middleware
app.use(express.json());
app.use(morgan('dev')); // Logs HTTP requests

// Routes
app.use('/api/posts', postRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

