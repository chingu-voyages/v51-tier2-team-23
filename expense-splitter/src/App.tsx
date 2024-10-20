import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage";
import GroupForm from "./components/GroupForm";
import Header from "./components/Header";
import GroupCardList from "./components/Groups";
import GroupDetails from "./components/GroupDetails";
import Modal from "./components/Modal";
import "./App.css";

import Analytics from "./components/Analytics";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const handleNewGroupClick = () => {
    setIsModalOpen(true);
  };

  return (
    <Router>
      <AppContent onNewGroupClick={handleNewGroupClick} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Router>
  );
};

// Separate component to hold the main content
const AppContent: React.FC<{ onNewGroupClick: () => void; isModalOpen: boolean; setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ onNewGroupClick, isModalOpen, setIsModalOpen }) => {
  const location = useLocation(); // Now this is within the Router context

  return (
    <div className="App">
      <Header onNewGroupClick={onNewGroupClick} isFixed={location.pathname === '/analytics'} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <GroupForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/groups" element={<GroupCardList />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
