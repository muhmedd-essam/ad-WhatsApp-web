// src/contexts/PlatformsContext.js
import React, { createContext, useState } from "react";

// Create the context
export const PlatformsContext = createContext();

// Provider component
export const PlatformsProvider = ({ children }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Method to update the selected platforms array
  const choosePlatform = (platform) => {
    setSelectedPlatforms((prevPlatforms) => [...prevPlatforms, platform]);
  };

  return (
    <PlatformsContext.Provider value={{ selectedPlatforms, choosePlatform }}>
      {children}
    </PlatformsContext.Provider>
  );
};
