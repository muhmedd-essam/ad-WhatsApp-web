import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.scss";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Menu } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";

const Navbar = ({ toggleAside }) => {
  // Get the auth state and logout function from context
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle logout and navigate to home
  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/"); // Navigate to home page
  };

  return (
    // <nav className="navbar navbar-expand-lg navbar-dark bg-purple p-4">
    //   <div className="container">
    //     <a className="navbar-brand" href="#home">
    //       اللوغو
    //     </a>

    //     {auth ? ( // If the user is authenticated, show the logout button
    //       <button className="btn text-white" onClick={toggleAside}>
    //         <Menu />
    //       </button>
    //     ) : null}

    //     {auth ? null : (
    //       <>
    //         <button
    //           className="navbar-toggler"
    //           type="button"
    //           data-bs-toggle="collapse"
    //           data-bs-target="#navbarNav"
    //           aria-controls="navbarNav"
    //           aria-expanded="false"
    //           aria-label="Toggle navigation"
    //         >
    //           <span className="navbar-toggler-icon"></span>
    //         </button>

    //         <div className="collapse navbar-collapse flex-end" id="navbarNav">
    //           <ul className="navbar-nav m-auto px-3">
    //             <li className="nav-item">
    //               <a className="nav-link text-white" href="#how-it-works">
    //                 كيف يعمل البرنامج
    //               </a>
    //             </li>
    //             <li className="nav-item">
    //               <a className="nav-link text-white" href="#features">
    //                 المميزات الاحترافية
    //               </a>
    //             </li>
    //             <li className="nav-item">
    //               <a className="nav-link text-white" href="#whatsapp-features">
    //                 بافات واتساب
    //               </a>
    //             </li>
    //             <li className="nav-item">
    //               <a className="nav-link text-white" href="#partners">
    //                 الشركاء
    //               </a>
    //             </li>
    //             <li className="nav-item">
    //               <a className="nav-link text-white" href="#faq">
    //                 الأسئلة
    //               </a>
    //             </li>

    //             <li className="nav-item text-white dropdown">
    //               <button
    //                 className="btn btn-secondary bg-transparent border-0 pr-0 dropdown-toggle"
    //                 type="button"
    //                 id="dropdownMenu2"
    //                 data-bs-toggle="dropdown"
    //                 aria-expanded="false"
    //               >
    //                 اختيار اللغة
    //               </button>
    //               <ul
    //                 className="dropdown-menu"
    //                 aria-labelledby="languageDropdown"
    //               >
    //                 <li>
    //                   <a className="dropdown-item" href="#arabic">
    //                     العربية
    //                   </a>
    //                 </li>
    //                 <li>
    //                   <a className="dropdown-item" href="#english">
    //                     English
    //                   </a>
    //                 </li>
    //               </ul>
    //             </li>
    //           </ul>
    //         </div>
    //       </>
    //     )}

    //     {/* Handle login/logout */}
    //     <ul className="navbar-nav px-3">
    //       {auth ? (
    //         <li className="nav-item">
    //           <button
    //             className="nav-link text-white bg-transparent border-0"
    //             onClick={handleLogout} // Use the handleLogout function
    //           >
    //             تسجيل الخروج
    //           </button>
    //         </li>
    //       ) : (
    //         <li className="nav-item">
    //           <Link className="nav-link text-white" to={"/login"}>
    //             تسجيل الدخول
    //           </Link>
    //         </li>
    //       )}
    //     </ul>
    //   </div>
    // </nav>
    <nav className="navbar navbar-expand-lg navbar-dark bg-purple p-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          اللوغو
        </Link>

        <div className="d-flex align-items-center justify-content-end">
        <ul className="navbar-nav">
            {auth ? (
              <li className="nav-item">
                <button
                  className="nav-link text-white bg-transparent border-0"
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </button>
              </li>
            ) : (
              ""
            )}
          </ul>
          {auth && (
            <button className="btn text-white me-2" onClick={toggleAside}>
              <Menu />
            </button>
          )}
          
        </div>

        {!auth && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse flex-end" id="navbarNav">
              <ul className="navbar-nav m-auto px-3">
                <li className="nav-item">
                  <a className="nav-link text-white" href="#how-it-works">
                    كيف يعمل البرنامج
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#features">
                    المميزات الاحترافية
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#whatsapp-features">
                    باقات واتساب
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#partners">
                    الشركاء
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#faq">
                    الأسئلة
                  </a>
                </li>

                <li className="nav-item text-white dropdown">
                  <button
                    className="btn btn-secondary bg-transparent border-0 pr-0 dropdown-toggle"
                    type="button"
                    id="dropdownMenu2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    اختيار اللغة
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="languageDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#arabic">
                        العربية
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#english">
                        English
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
