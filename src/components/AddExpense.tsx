import React, { useState } from "react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../utils/StorageService"; // Ensure these functions are implemented
import "../styles/AddExpense.css"; // Import the CSS file

interface Participant {
  name: string;
  contribution: string; // Contribution amount
  avatarUrl: string;
  weight: number; // Weight of contribution for split
}

interface AddExpenseProps {
  groupId: number; // Group ID to associate expenses
  onExpenseAdded: () => void; // Callback to refresh expenses list
  onClose: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({
  groupId,
  onExpenseAdded,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantContribution, setNewParticipantContribution] = useState("");

  // New state for expense date
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());

  const handleAddExpense = () => {
    // Convert amount to a number for calculations
    const totalAmount = Number(amount);
  
    // Check if split evenly is selected
    const updatedParticipants = participants.map((participant) => {
      const contributionValue = Number(participant.contribution.split(" ")[0]);
      return {
        ...participant,
        weight: splitEvenly ? 100 / participants.length : participant.weight,
      };
    });
  
    // Create new expense object
    const newExpense = {
      id: Date.now(), // Using timestamp as unique ID
      title: name,
      amount: totalAmount,
      currency,
      description,
      participants: updatedParticipants, // Use updated participants with correct weights
      groupId, // Associate expense with specific group
      receipt: receipt ? receipt.name : null, // Store receipt name or null if not uploaded
      date, // Add date to the expense object
    };
  
    // Log updated participants with weights to the console
    console.log("Participants with updated weights:", updatedParticipants);
  
    // Get existing expenses and add the new one
    const storedExpenses = getFromLocalStorage("expenses") || [];
    saveToLocalStorage("expenses", [...storedExpenses, newExpense]);
  
    // Clear form fields
    setName("");
    setAmount("");
    setCurrency("USD");
    setDescription("");
    setParticipants([]);
    setReceipt(null);
    setNewParticipantName("");
    setNewParticipantContribution("");
  
    // Call the onExpenseAdded to refresh the expenses list
    onExpenseAdded();
  };
  

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setReceipt(event.target.files[0]);
    }
  };

  const handleWeightChange = (index: number, value: number) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index].weight = value;
    setParticipants(updatedParticipants);
  };

  const handleAddParticipant = () => {
    if (newParticipantName.trim() && newParticipantContribution.trim()) {
      const newParticipant: Participant = {
        name: newParticipantName,
        contribution: `${newParticipantContribution} ${currency}`, // Set contribution with currency
        avatarUrl: "https://img.icons8.com/?size=100&id=61161&format=png&color=000000https://cdn.usegalileo.ai/stability/e995b051-eff4-4ba3-964c-7ebd7b82b9dc.png", // Placeholder for avatar
        weight: 0,
      };
      setParticipants([...participants, newParticipant]);
      setNewParticipantName("");
      setNewParticipantContribution(""); // Reset after adding
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header section with logo and close button */}
        <header className="modal-header">
          <div className="logo-section">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727Z"
                fill="currentColor"
              ></path>
            </svg>
            <h2 className="logo-text">Splitty</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </header>
        <div className="content">
          <div className="form-container">
            <p className="form-title">Add an expense</p>

            <div className="form-group">
              <label>
                <input
                  placeholder="Name"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  placeholder="Amount"
                  type="number"
                  className="input-field"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <select
                  className="input-field"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  {/* Add more currencies as needed */}
                </select>
              </label>
            </div>

            <div className="form-group">
              <label>
                <textarea
                  placeholder="Description"
                  className="textarea-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={splitEvenly}
                  onChange={() => setSplitEvenly(!splitEvenly)}
                  className="checkbox-input"
                />
                Split evenly among participants
              </label>
            </div>

            <h3 className="participants-title">Participants</h3>
            {participants.map((participant, index) => (
              <div key={index} className="participant">
                <div
                  className="participant-avatar"
                  style={{
                    backgroundImage: `url("${participant.avatarUrl}")`,
                  }}
                ></div>
                <div className="participant-info">
                  <p className="participant-name">{participant.name}</p>
                  <p className="participant-contribution">
                    Contribution: {participant.contribution}
                  </p>
                  {splitEvenly ? (
                    <p className="participant-weight">
                      Weight: {100 / participants.length}%
                    </p>
                  ) : (
                    <input
                      type="number"
                      placeholder="Weight"
                      value={participant.weight}
                      onChange={(e) =>
                        handleWeightChange(index, Number(e.target.value))
                      }
                      className="weight-input"
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="new-participant">
              <input
                placeholder="New Participant Name"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                className="input-field"
              />
              <input
                placeholder="Contribution Amount"
                type="number"
                value={newParticipantContribution}
                onChange={(e) =>
                  setNewParticipantContribution(e.target.value)
                }
                className="input-field"
              />
              <button
                className="add-participant-button"
                onClick={handleAddParticipant}
              >
                Add
              </button>
            </div>

            <div className="receipt-upload">
              <h3 className="receipt-title">Receipt Upload</h3>
              <input
                type="file"
                onChange={handleReceiptChange}
                className="file-input"
              />
            </div>

            {/* Buttons at the bottom */}
            <div className="buttons">
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button className="save-button" onClick={handleAddExpense}>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
