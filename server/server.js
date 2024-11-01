const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const BlogPostModel = require('./BlogPost'); // Adjust path as needed

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
  try {
    const { title, content, image, tags } = req.body;

    // Create a new blog post object with default values
    const newBlogPost = new BlogPostModel({
      title: title || "Untitled",  // Default title if none provided
      content: content || "",       // Default to empty content
      image: image || null,         // Default to null if no image
      tags: tags || [],             // Default to an empty array if tags not provided
    });

    // Save the blog post to the database
    const savedBlogPost = await newBlogPost.save();
    res.status(201).json(savedBlogPost); // Respond with the created blog post
  } catch (error) {
    console.error('Error saving blog post:', error);
    res.status(500).json({ error: 'Failed to save blog post', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
