import React, { useState } from "react";
import "./App.css";

const FileUpload = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    onFileSelect(file);
  };

  return (
    <div className="button">
      <input
        type="file"
        id="fileInput"
        accept=".epub"
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput">Choose an EPUB file</label>
    </div>
  );
};

export default FileUpload;
