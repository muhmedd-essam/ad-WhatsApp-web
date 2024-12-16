import React, { useState } from "react";
import "./Layout.scss";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SideBar from "../Sidebar/SideBar";

const Layout = ({ children }) => {
  const [isAsideVisible, setIsAsideVisible] = useState(false);

  const toggleAside = () => {
    setIsAsideVisible(!isAsideVisible);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar toggleAside={toggleAside} />
      {/* Main Content Area */}
      <div className="container-fluid flex-grow-1 d-flex p-0 position-relative overflow-hidden">
        {/* Aside (Toggle-able) */}
        <SideBar isAsideVisible={isAsideVisible} />
        {/* Main Content */}
        <div
          className={`content flex-grow-1 p-3 content-transition ${
            isAsideVisible ? "content-shifted" : ""
          }`}
        >
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
