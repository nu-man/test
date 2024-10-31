import React, { useState } from "react";

const Editor = ({ onAddContent }) => {
  const [type, setType] = useState('');
  const [content, setContent] = useState({ text: '', url: '', src: '', alt: '', list: [] });
  const [headerSize, setHeaderSize] = useState('h1');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const handleAddContent = () => {
    const newContent = {
      text: content.text,
      attributes: { type, size: headerSize, bold: isBold, italic: isItalic },
      list: content.list
    };

    if (type === 'link') {
      newContent.attributes.url = content.url;
    } else if (type === 'image') {
      newContent.attributes.src = content.src;
      newContent.attributes.alt = content.alt;
    }

    onAddContent(newContent);
    setContent({ text: '', url: '', src: '', alt: '', list: [] });
    setType('');
    setIsBold(false);
    setIsItalic(false);
  };

  const handleAddList = () => {
    if (content.text) {
      setContent({ ...content, list: [...content.list, content.text], text: '' });
    }
  };

  return (
    <div>
      <h2>Add Content</h2>
      <div>
        <button onClick={() => setType('header')}>Add Header</button>
        <button onClick={() => setType('paragraph')}>Add Paragraph</button>
        <button onClick={() => setType('link')}>Add Link</button>
        <button onClick={() => setType('image')}>Add Image</button>
        <button onClick={() => setType('list')}>Add List</button>
      </div>

      {type && (
        <div style={{ marginTop: '10px' }}>
          <h3>{`Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}</h3>
          {type === 'header' && (
            <>
              <select onChange={(e) => setHeaderSize(e.target.value)} value={headerSize}>
                <option value="h1">Header 1</option>
                <option value="h2">Header 2</option>
                <option value="h3">Header 3</option>
              </select>
              <input
                type="text"
                placeholder="Enter header text"
                value={content.text}
                onChange={(e) => setContent({ ...content, text: e.target.value })}
              />
            </>
          )}
          {(type === 'paragraph') && (
            <input
              type="text"
              placeholder="Enter text"
              value={content.text}
              onChange={(e) => setContent({ ...content, text: e.target.value })}
            />
          )}
          {type === 'link' && (
            <>
              <input
                type="text"
                placeholder="Enter link text"
                value={content.text}
                onChange={(e) => setContent({ ...content, text: e.target.value })}
              />
              <input
                type="text"
                placeholder="Enter URL"
                value={content.url}
                onChange={(e) => setContent({ ...content, url: e.target.value })}
              />
            </>
          )}
          {type === 'image' && (
            <>
              <input
                type="text"
                placeholder="Enter image source URL"
                value={content.src}
                onChange={(e) => setContent({ ...content, src: e.target.value })}
              />
              <input
                type="text"
                placeholder="Enter alt text"
                value={content.alt}
                onChange={(e) => setContent({ ...content, alt: e.target.value })}
              />
            </>
          )}
          {type === 'list' && (
            <>
              <input
                type="text"
                placeholder="Enter list item"
                value={content.text}
                onChange={(e) => setContent({ ...content, text: e.target.value })}
              />
              <button onClick={handleAddList}>Add to List</button>
              <h4>List Items:</h4>
              <ul>
                {content.list.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </>
          )}
          <button onClick={handleAddContent}>Add {type}</button>
          <div>
            <button onClick={() => setIsBold(!isBold)}>
              {isBold ? 'Remove Bold' : 'Add Bold'}
            </button>
            <button onClick={() => setIsItalic(!isItalic)}>
              {isItalic ? 'Remove Italics' : 'Add Italics'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
