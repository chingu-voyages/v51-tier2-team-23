import React, { useState } from "react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../utils/StorageService"; // Ensure these functions are implemented

interface Expense {
  id: number;
  title: string;
  amount: string;
  groupId: number;
}

interface ExpenseFormProps {
  groupId: number; // Receive groupId as a prop
  onExpenseAdded: () => void; // Callback function to refresh expenses after adding
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  groupId,
  onExpenseAdded,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Create new expense
    const newExpense: Expense = {
      id: Date.now(), // Using timestamp as unique ID
      title,
      amount,
      groupId,
    };

    // Get existing expenses and add the new one
    const storedExpenses: Expense[] = getFromLocalStorage("expenses") || [];
    saveToLocalStorage("expenses", [...storedExpenses, newExpense]);

    // Clear form fields
    setTitle("");
    setAmount("");

    // Call the onExpenseAdded to refresh the expenses list
    onExpenseAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label htmlFor="title">Expense Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
