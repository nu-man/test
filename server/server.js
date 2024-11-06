import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import blogRoutes from './routes/blog.js';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace with your MongoDB URI)
const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://mohdnuman198:numan@test.fkrtk.mongodb.net/?retryWrites=true&w=majority&appName=test',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the app if MongoDB connection fails
  }
};

connectDB();

// Use the blog routes
app.use('/api/blogs', blogRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
