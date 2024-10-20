import React from "react";
import "../../styles/Card.css"; // Import the CSS file

interface CardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const Card: React.FC<CardProps> = ({ icon, title, subtitle }) => {
  return (
    <div className="card22">
      <div className="icon-container">{icon}</div>
      <div className="text-container">
        <p className="title">{title}</p>
        <p className="subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default Card;
