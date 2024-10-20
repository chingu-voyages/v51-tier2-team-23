import React, { useState, useEffect } from "react";
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

interface Expense {
  id: number;
  title: string;
  amount: number;
  currency: string;
  description: string;
  participants: Participant[];
  groupId: number;
  receipt: string | null;
  date: string;
  category: string;
}

interface AddExpenseProps {
  groupId: number; // Group ID to associate expenses
  onExpenseAdded: () => void; // Callback to refresh expenses list
  onClose: () => void;
  expense?: Expense; // Optional prop for editing an expense
}

const AddExpense: React.FC<AddExpenseProps> = ({
  groupId,
  onExpenseAdded,
  onClose,
  expense, // New prop for existing expense
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantContribution, setNewParticipantContribution] = useState("");
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());
  const [category, setCategory] = useState("");
  // Effect to populate fields when editing an existing expense
  useEffect(() => {
    if (expense) {
      setName(expense.title);
      setAmount(expense.amount.toString());
      setCurrency(expense.currency);
      setDescription(expense.description);
      setParticipants(expense.participants);
      setDate(expense.date);
      setCategory(expense.category);
      // Additional logic if needed for other fields
    }
  }, [expense]);

  const handleAddExpense = () => {
    const totalAmount = Number(amount);

    const updatedParticipants = participants.map((participant) => {
      const contributionValue = Number(participant.contribution.split(" ")[0]);
      return {
        ...participant,
        weight: splitEvenly ? 100 / participants.length : participant.weight,
      };
    });

    const newExpense: Expense = {
      id: expense ? expense.id : Date.now(), // Use existing ID for updates
      title: name,
      amount: totalAmount,
      currency,
      description,
      participants: updatedParticipants,
      groupId,
      receipt: receipt ? receipt.name : expense?.receipt || null, // Handle receipt
      date,
      category,
    };

    const storedExpenses = getFromLocalStorage("expenses") || [];
    if (expense) {
      // Update the existing expense
      const updatedExpenses = storedExpenses.map((ex: Expense) =>
        ex.id === expense.id ? newExpense : ex
      );
      saveToLocalStorage("expenses", updatedExpenses);
    } else {
      // Add new expense
      saveToLocalStorage("expenses", [...storedExpenses, newExpense]);
    }

    // Clear form fields
    setName("");
    setAmount("");
    setCurrency("");
    setDescription("");
    setParticipants([]);
    setReceipt(null);
    setNewParticipantName("");
    setNewParticipantContribution(""); // Reset after adding
    setCategory("");
    // Call the onExpenseAdded to refresh the expenses list
    onExpenseAdded();
    onClose();
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

  const handleRemoveParticipant = (index: number) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
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
            <h2 className="logo-text">Splitty</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </header>
        <div className="content">
          <div className="form-container">
            <p className="form-title">{expense ? "Edit Expense" : "Add an expense"}</p>

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
                <select
                
                  className="input-field select-placeholder"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                   <option value="" disabled>Category</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Trip">Trip</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Other">Other</option>
                  {/* Add more currencies as needed */}
                </select>
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
                {/* Remove button (arrow icon) */}
                <button
                  className="remove-participant-button"
                  onClick={() => handleRemoveParticipant(index)}
                >
                  &#10005; {/* You can replace this with an arrow icon */}
                </button>
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
                {expense ? "Update Expense" : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
