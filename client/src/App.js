import React, { useState } from "react";
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState(''); // State for title input

  const toggleStyle = (command) => {
    document.execCommand(command, false, null);
  };

  const handleAddElement = (type, size = "p") => {
    const newElement = {
      id: Date.now(),
      type: type,
      content: type === "image" ? "" : "Editable text",
      attributes: {
        type: type,
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

  // Send the entire content object to the API
  const handleSubmit = async () => {
    const blogPost = {
      title: title, // Use the title state
      content: data.map(element => {
        if (element.type === "image" && element.content) { // Only include if the image content is present
          return `<img src="${element.content}" alt="User added" />`;
        } else if (element.type === "header" || element.type === "paragraph") {
          return `<${element.attributes.size}>${element.content}</${element.attributes.size}>`;
        } else if (element.type === "list") {
          const listItems = element.list.map(item => `<li>${item}</li>`).join('');
          return `<${element.attributes.size}>${listItems}</${element.attributes.size}>`;
        }
        return ''; // For unrecognized types, return an empty string
      }).join('\n'),
    };
  
    // Check if the blog post is valid
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
        onChange={(e) => setTitle(e.target.value)} // Update title state on input change
      />

      <div className="toolbar">
        <button onClick={() => toggleStyle("bold")}>Bold</button>
        <button onClick={() => toggleStyle("italic")}>Italic</button>

        <select onChange={(e) => handleAddElement("header", e.target.value)} defaultValue="">
          <option value="" disabled>Select Heading</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>

        <button onClick={() => handleAddElement("paragraph")}>Add Paragraph</button>

        <select onChange={(e) => handleAddElement("list", e.target.value)} defaultValue="">
          <option value="" disabled>Select List Type</option>
          <option value="ul">Unordered List</option>
          <option value="ol">Ordered List</option>
        </select>

        <button onClick={() => handleAddElement("image")}>Add Image</button>

        <button onClick={handleSubmit} disabled={data.length === 0 || title === ''}>
          Send All Content
        </button>
      </div>

      <div className="content" style={{ border: "1px solid #ccc", padding: "10px" }}>
        {data.map((element, index) => {
          if (element.type === "image") {
            return (
              <div key={element.id}>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  onBlur={(e) => handleTextChange(index, e.target.value)}
                />
                {element.content && (
                  <img
                    src={element.content}
                    alt="User added"
                    style={{ width: "100%", height: "auto", marginBottom: "10px" }}
                  />
                )}
              </div>
            );
          } else if (element.type === "list") {
            const ListTag = element.attributes.size;
            return (
              <ListTag
                key={element.id}
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange(index, e.currentTarget.innerHTML)}
                style={{ marginBottom: "10px", fontWeight: "normal" }}
              >
                <li>Type here</li>
              </ListTag>
            );
          } else {
            const Tag = element.attributes.size;
            return (
              <Tag
                key={element.id}
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange(index, e.currentTarget.textContent)}
                style={{
                  fontWeight: element.attributes.bold ? "bold" : "normal",
                  fontStyle: element.attributes.italic ? "italic" : "normal",
                  fontSize:
                    element.attributes.size === "h1"
                      ? "32px"
                      : element.attributes.size === "h2"
                      ? "24px"
                      : element.attributes.size === "h3"
                      ? "20px"
                      : "16px",
                  marginBottom: "10px",
                }}
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
