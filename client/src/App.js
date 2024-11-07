import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';

function App() {
  const [blogData, setBlogData] = useState({
    title: '',
    coverImageSrc: '',
    author: '',
    content: '',
    summary: '',
    tags: [],
    categories: [],
    isPublished: false,
    publishedAt: new Date(),
  });

  // Handler to update blog data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // For tags and categories (to handle comma-separated input)
  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setBlogData((prevState) => ({
      ...prevState,
      [field]: value.split(','),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/blogs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }

      const data = await response.json();
      console.log('Blog created successfully:', data);

      // Reset the form fields
      setBlogData({
        title: '',
        coverImageSrc: '',
        author: '',
        content: '',
        summary: '',
        tags: [],
        categories: [],
        isPublished: false,
        publishedAt: new Date(),
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Create Blog Post</h1>
      <form className="blog-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={blogData.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="coverImageSrc"
          placeholder="Cover Image URL"
          value={blogData.coverImageSrc}
          onChange={handleChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={blogData.author}
          onChange={handleChange}
        />
        <textarea
          name="summary"
          placeholder="Summary"
          value={blogData.summary}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={blogData.tags.join(',')}
          onChange={(e) => handleArrayChange(e, 'tags')}
        />
        <input
          type="text"
          name="categories"
          placeholder="Categories (comma separated)"
          value={blogData.categories.join(',')}
          onChange={(e) => handleArrayChange(e, 'categories')}
        />
        <div className="editor-container">
          <ReactQuill
            theme="snow"
            value={blogData.content}
            onChange={(value) => setBlogData({ ...blogData, content: value })}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
