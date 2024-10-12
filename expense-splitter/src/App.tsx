// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import GroupForm from "./components/GroupForm";
import Header from "./components/Header";
import GroupCardList from "./components/Groups";
import GroupDetails from "./components/GroupDetails";
import Modal from "./components/Modal"; // Import Modal component
import "./App.css";
import AddExpense from "./components/AddExpense";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const handleNewGroupClick = () => {
    setIsModalOpen(true);
  };
  const handleAddExpenseClick = () => {
    setIsExpenseModalOpen(true);
  };
  return (
    <Router>
      <div className="App">
        <Header onNewGroupClick={handleNewGroupClick} />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <GroupForm onClose={() => setIsModalOpen(false)} />
        </Modal>

        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/groups" element={<GroupCardList />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

// import React, { Component } from "react";
// import "./App.css";
// import GroupDetails from "./components/GroupInfoDetails";

// class App extends Component {
//   render() {
//     return (
//       <main className="container">
//         <GroupDetails />
//       </main>
//     );
//   }
// }

// export default App;
