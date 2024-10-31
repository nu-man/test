import React, { useState } from "react";
import Editor from './Editor';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);

  const handleAddContent = (newContent) => {
    setData([...data, newContent]);
  };

  const handleSendData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Data sent successfully:', result);
      setData([]); // Clear data after sending if desired
    } else {
      console.error('Failed to send data');
    }
  };


    return (
      <div>
        <Editor onAddContent={handleAddContent} />
        <button onClick={handleSendData} disabled={data.length === 0}>
          Send All Content
        </button>
        <div className="content">
          {data.map((ele, index) => {
            const Tag = ele.attributes.size || 'p'; // Use size for headers, fallback to paragraph
            return (
              <Tag
                key={index}
                style={{
                  fontWeight: ele.attributes.bold ? 'bold' : 'normal',
                  fontStyle: ele.attributes.italic ? 'italic' : 'normal',
                }}
              >
                {ele.list && ele.list.length > 0 ? (
                  <div>
                    <h4>{ele.text}</h4>
                    <ul>
                      {ele.list.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>
                ) : (
                  ele.text
                )}
              </Tag>
            );
          })}
        </div>
      </div>
    );
    

};

export default App;
