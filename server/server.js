const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const BlogPostModel = require('./BlogPost'); // Adjust path as needed

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://mohdnuman198:numan@test.fkrtk.mongodb.net/?retryWrites=true&w=majority&appName=test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully.');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Endpoint to create a new blog post
app.post('/api/blog', async (req, res) => {
  console.log('Received data:', req.body); // Log incoming data
  try {
    const { title, content, image, tags } = req.body;

    const newBlogPost = new BlogPostModel({
      title: title || "Untitled",
      content: content || "",
      image: image || null,
      tags: tags || [],
    });

    const savedBlogPost = await newBlogPost.save();
    console.log('Saved blog post:', savedBlogPost); // Log saved data
    res.status(201).json(savedBlogPost);
  } catch (error) {
    console.error('Error saving blog post:', error);
    res.status(500).json({ error: 'Failed to save blog post', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
