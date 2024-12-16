import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const WhatsAppContext = createContext();

export const WhatsAppProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:4000/");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WhatsApp server");
      setClientReady(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WhatsApp server");
      setClientReady(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WhatsAppContext.Provider value={{ socket, clientReady }}>
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  return useContext(WhatsAppContext);
};
