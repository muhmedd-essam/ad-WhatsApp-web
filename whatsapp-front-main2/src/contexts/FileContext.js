import React, { createContext, useState } from "react";

// Create the FileContext
export const FileContext = createContext();

// FileProvider component that holds the files and functions in the state
export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);

  // Function to handle uploading a new file
  const handleUpload = (newFile) => {
    setFiles([...files, newFile]);
  };

  // Function to handle deleting a file
  const handleDelete = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  return (
    <FileContext.Provider value={{ files, handleUpload, handleDelete }}>
      {children}
    </FileContext.Provider>
  );
};
