import React from 'react';
import '../styles/HeroSection.css'; // Create this CSS file
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/groups"); // Redirect to the Groups page
  };
  return (
    <div className="hero-section" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/stability/3f1a21c9-87d8-48e5-be96-2510253f261f.png")' }}>
      <div className="hero-content">
        <h1 className="hero-title">Share and track group expenses</h1>
        <h2 className="hero-subtitle">Splitty helps you share expenses with friends, roommates, and family. Keep track of who owes you what.</h2>
        <button className="hero-button"  onClick={handleGetStartedClick} >Get started</button>
      </div>
    </div>
  );
};

export default HeroSection;
