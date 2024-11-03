import React, { useState } from "react";
import './App.css';
import { FaBold, FaItalic, FaListUl, FaImage, FaPaperPlane } from 'react-icons/fa';

const App = () => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');

  const toggleStyle = (command) => {
    document.execCommand(command, false, null);
  };

  const handleAddElement = (type, size = "p") => {
    const newElement = {
      id: Date.now(),
      type: type,
      content: type === "image" ? "" : "Editable text",
      attributes: {
        size: type === "paragraph" ? 'p' : size,
        bold: false,
        italic: false,
      },
      list: type === "list" ? [] : undefined,
    };
    setData([...data, newElement]);
  };

  const handleTextChange = (index, newText) => {
    const updatedData = [...data];
    updatedData[index].content = newText;
    setData(updatedData);
  };

  const handleSubmit = async () => {
    const blogPost = {
        title: title,
        content: data.map(element => {
            if (element.type === "image" && element.content) {
                return `<img src="${element.content}" alt="User added" />`;
            } else if (element.type === "header" || element.type === "paragraph") {
                return `<${element.attributes.size}>${element.content}</${element.attributes.size}>`;
            } else if (element.type === "list") {
                const listItems = element.list.map(item => `<li>${item}</li>`).join('');
                return `<ul>${listItems}</ul>`;
            }
            return '';
        }).join('\n'),
    };

    console.log('Submitting blog post:', blogPost); // Log the blog post object

    if (!blogPost.title || !blogPost.content) {
        alert('Title and content are required');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blogPost),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Blog post created successfully:', responseData);
    } catch (error) {
        console.error('Error creating blog post:', error);
    }
};


  return (
    <div className="app">
      <input
        type="text"
        placeholder="Enter Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />

      <div className="toolbar">
        <button onClick={() => toggleStyle("bold")} className="toolbar-button">
          <FaBold />
        </button>
        <button onClick={() => toggleStyle("italic")} className="toolbar-button">
          <FaItalic />
        </button>

        <select onChange={(e) => handleAddElement("header", e.target.value)} defaultValue="" className="heading-select">
          <option value="p">Paragraph</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>

        <button onClick={() => handleAddElement("list", "ul")} className="toolbar-button">
          <FaListUl />
        </button>

        <button onClick={() => handleAddElement("image")} className="toolbar-button">
          <FaImage />
        </button>

        <button onClick={handleSubmit} disabled={data.length === 0 || title === ''} className="toolbar-button send-button">
          Save <FaPaperPlane />
        </button>
      </div>

      <div className="content">
        {data.map((element, index) => {
          if (element.type === "image") {
            return (
              <div key={element.id} className="image-container">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  onBlur={(e) => handleTextChange(index, e.target.value)}
                />
                {element.content && (
                  <img
                    src={element.content}
                    alt="User added"
                    className="image-preview"
                  />
                )}
              </div>
            );
          } else if (element.type === "list") {
            return (
              <ul
                key={element.id}
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange(index, e.currentTarget.innerHTML)}
                className="list"
              >
                <li>Type here</li>
              </ul>
            );
          } else {
            const Tag = element.attributes.size;
            return (
              <Tag
                key={element.id}
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange(index, e.currentTarget.textContent)}
                className="editable-text"
              >
                {element.content}
              </Tag>
            );
          }
        })}
      </div>
    </div>
  );
};

export default App;
