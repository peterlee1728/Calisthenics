import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      {/* <div className="header-container">
        <div className="m-0 text-base">
          <p>Calisthenics Admin</p>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#" className="nav-link">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Settings
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Users
              </a>
            </li>
          </ul>
        </nav>
        <div className="user-info">
          <span className="user-name">Admin User</span>
        </div>
      </div> */}
      <div>
        <div className="flex align-items-center gap-2">
          <i className="pi pi-sparkles" style={{ color: "#708090" }}></i>
          <p className="m-0 text-base">Calisthenics Admin</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
