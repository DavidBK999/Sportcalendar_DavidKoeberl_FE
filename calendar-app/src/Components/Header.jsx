import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

/**
 * Header Component
 * A fixed navigation bar displaying the app logo and links.
 */
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        Sp<span className="red">o</span>rtevents Calendar
      </div>
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <Link to="/events">Go to Events</Link>
          </li>
          <li>
            <Link to="/">Calendar</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
