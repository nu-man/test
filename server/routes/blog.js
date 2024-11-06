import express from 'express';
import Blog from '../models/BlogPost.js';

const router = express.Router();

// POST route to create a blog
router.post('/create', async (req, res) => {
  const { title, coverImageSrc, content, summary, tags, categories, isPublished, publishedAt } = req.body;
//author
  // Validate required fields
  if (!title  || !content) {//|| !author
    return res.status(400).json({ message: 'Title, author, and content are required.' });
  }

  try {
    const newBlog = new Blog({
      title,
      // author,
      coverImageSrc,
      content,
      summary,
      tags,
      categories,
      isPublished,
      publishedAt,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: savedBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
});

// GET route to fetch all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs from the database
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

export default router;
