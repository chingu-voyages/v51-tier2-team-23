import React from "react";
import "../styles/Header.css"; // Create this CSS file
import { useNavigate, NavLink } from "react-router-dom"; // Import NavLink

interface HeaderProps {
  onNewGroupClick: () => void; // Function to handle new group creation
  isFixed?: boolean; // New prop to determine if the header should be fixed
}

const Header: React.FC<HeaderProps> = ({ onNewGroupClick, isFixed }) => {
  const navigate = useNavigate();

  return (
    <header className={`header ${isFixed ? 'fixed' : ''}`}>
      <div className="header-content">
        <div className="logo-section">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
              fill="currentColor"
            ></path>
          </svg>
          <h2 className="logo-text">Splitty</h2>
        </div>

        <div className="nav-actions">
          <nav className="nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
              Home 
            </NavLink>
            <NavLink 
              to="/groups" 
              className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
              Groups
            </NavLink>
            <NavLink 
              to="/analytics" 
              className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
              Analytics
            </NavLink>
          </nav>
          <button
            className="new-group-button"
            onClick={onNewGroupClick}
          >
            New group
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
