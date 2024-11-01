// models/BlogPost.js
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true, // Title is required
  },
  content: {
    type: String,
    // required: true, // Content is required
  },
  
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the created date
  },
});

const BlogPostModel = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPostModel;
