import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div>
        <div className="flex items-center gap-2">
          {/* <i className="pi pi-sparkles" style={{ color: "#708090" }}></i> */}
          <p className="m-0 text-base">Calisthenics Admin</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
