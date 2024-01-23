import React, { useState } from "react";

const FileUpload = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    onFileSelect(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".epub" />
      {file && <p>File name: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
