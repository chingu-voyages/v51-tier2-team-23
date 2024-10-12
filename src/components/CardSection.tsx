import React from 'react';
import '../styles/CardSection.css'; // Create this CSS file

const CardSection: React.FC = () => {
  const cards = [
    { title: 'Roommates', description: 'Split rent, utilities, and groceries', imageUrl: 'https://cdn.usegalileo.ai/sdxl10/3a4bc566-a2f9-40bb-b275-3a348f14e5f6.png' },
    { title: 'Friends', description: 'Share meals, gifts, and travel', imageUrl: 'https://cdn.usegalileo.ai/stability/ee2b6b86-f13f-487a-b26d-6ef178ea9929.png' },
    { title: 'Couples', description: 'Even out date nights and trips', imageUrl: 'https://cdn.usegalileo.ai/stability/de34bada-e604-4bdb-b117-f72b392821a0.png' },
    { title: 'Family', description: 'Split holidays and vacations', imageUrl: 'https://cdn.usegalileo.ai/stability/3c9953f9-d037-4e8c-b044-732410caf41e.png' },
  ];

  return (
    <div className="card-section">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className="card-image" style={{ backgroundImage: `url(${card.imageUrl})` }}></div>
          <div className="card-info">
            <p className="card-title">{card.title}</p>
            <p className="card-description">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSection;
