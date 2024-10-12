import React, { useState } from "react";
import Header from "./Header"; // Make sure this path is correct
import HeroSection from "./HeroSection";
import CardSection from "./CardSection";
import GroupForm from "./GroupForm";

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewGroupClick = () => {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  return (
    <>
      <HeroSection />
      <CardSection />
      {isModalOpen && <GroupForm onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default HomePage;
