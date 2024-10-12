import React, { useState } from "react";
import "../styles/GroupForm.css";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { addItemToLocalStorageArray } from "../utils/StorageService"; // Import the utility function

interface GroupFormProps {
  onClose: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateGroup = () => {
    // Prevent further submissions while processing
    if (isProcessing) return;

    // Clear previous notification
    setNotification(null);
    setIsProcessing(true);

    // Validation checks
    const errors: string[] = [];

    if (!groupName) {
      errors.push("Group Name is required.");
    } else if (groupName.length < 3) {
      errors.push("Group Name must be at least 3 characters long.");
    }

    if (!description) {
      errors.push("Description is required.");
    } else if (description.length < 10) {
      errors.push("Description must be at least 10 characters long.");
    }

    if (!budget) {
      errors.push("Budget is required.");
    } else {
      const budgetValue = Number(budget);
      if (isNaN(budgetValue)) {
        errors.push("Budget must be a number.");
      } else if (budgetValue <= 0) {
        errors.push("Budget must be a positive number.");
      }
    }

    if (errors.length > 0) {
      setNotification({ message: errors.join(" "), type: "error" });
      setIsProcessing(false);
    } else {
      // Create group object
      const newGroup = {
        id: Date.now(), // Unique ID based on current timestamp
        groupName,
        description,
        budget: Number(budget),
        currency,
        totalExpenses: 0,
        amountOwed: 0,
        imageUrl:
          "https://cdn.usegalileo.ai/stability/729e7a19-9450-4e5a-a795-fb4ccb57f91a.png", // Placeholder image
      };

      // Save the group using storage service
      addItemToLocalStorageArray("groups", newGroup);

      setNotification({
        message: "Group created successfully!",
        type: "success",
      });
      setGroupName("");
      setDescription("");
      setBudget("");

      // Redirect after a short delay and refresh the page
      setTimeout(() => {
        onClose();
        navigate("/groups"); // Redirect to the groups page
        window.location.reload(); // Refresh the groups page
      }, 1000);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
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
          <h1 className="section-title">Create a group</h1>

          <div className="form-group">
            <label>
              <span>Group Name</span>
              <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <span>Description</span>
              <textarea
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>
          </div>

          <div className="form-inline">
            <div className="form-group-inline">
              <label>
                <span>Allocated Budget</span>
                <input
                  type="text"
                  placeholder="Enter budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </label>
            </div>
            <div className="form-group-inline">
              <label>
                <span>Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                </select>
              </label>
            </div>
          </div>

          <div className="buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="save-button"
              onClick={handleCreateGroup}
              disabled={isProcessing}
            >
              {isProcessing ? "Creating..." : "Create Group"}
            </button>
          </div>

          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={handleCloseNotification}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupForm;
