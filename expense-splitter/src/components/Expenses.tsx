import React, { useEffect, useState } from "react";
import "../styles/Expenses.css";
import { getFromLocalStorage } from "../utils/StorageService";
import AddExpense from "./AddExpense";
import Modal from "./Modal";

interface Participant {
  name: string;
  contribution: string;
  avatarUrl: string;
  weight: number;
}

interface Expense {
  id: number;
  title: string;
  amount: number; // Change to number here
  currency: string;
  description: string;
  participants: Participant[];
  groupId: number;
  receipt: string | null;
  date: string; // Date should be stored as a string
  category:string;
}

interface ExpensesProps {
  groupId: number;
}

const Expenses: React.FC<ExpensesProps> = ({ groupId }) => {
  const [expensesData, setExpensesData] = useState<Expense[]>([]);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);

  useEffect(() => {
    const storedExpenses: Expense[] = getFromLocalStorage("expenses") || [];
    const groupExpenses = storedExpenses
      .filter((expense) => expense.groupId === groupId)
      .map((expense) => ({
        ...expense,
        amount: parseFloat(expense.amount.toString()), // Ensure amount is a number
      }));
    setExpensesData(groupExpenses);
  }, [groupId]);

  const refreshExpenses = () => {
    const storedExpenses: Expense[] = getFromLocalStorage("expenses") || [];
    const groupExpenses = storedExpenses
      .filter((expense) => expense.groupId === groupId)
      .map((expense) => ({
        ...expense,
        amount: parseFloat(expense.amount.toString()), // Ensure amount is a number
      }));
    setExpensesData(groupExpenses);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense); // Set the expense to be edited
    setIsAddExpenseModalOpen(true); // Open the modal
  };

  return (
    <div className="expenses-container">
      {/* Render expenses list */}
      <div className="expenses-list">
        {expensesData.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-info">
              <div className="expense-icon">
                {/* SVG icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z"></path>
                </svg>
              </div>
              <div className="expense-details">
                <p className="expense-title">{expense.title}</p>
                <p className="expense-amount">
                  ${parseFloat(String(expense.amount)).toFixed(2)}
                  <span className="expense-participant-count">
                    {" "}
                    · {expense.participants.length} Participants
                  </span>
                  <span className="expense-date">
                    {" "}. {(expense.date)}
                  </span>
                </p>
              </div>
            </div>
            <div
              className="expense-arrow"
              onClick={() => handleEditExpense(expense)} // Open the AddExpense form pre-populated
            >
              {/* Arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Button to trigger the Add Expense modal */}
      <button
        className="add-expense-button"
        onClick={() => {
          setExpenseToEdit(undefined); // Reset if adding a new expense
          setIsAddExpenseModalOpen(true);
        }}
      >
        Add Expense
      </button>

      {/* Modal for Add Expense */}
      <Modal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
      >
        <AddExpense
          groupId={groupId}
          onExpenseAdded={refreshExpenses}
          onClose={() => setIsAddExpenseModalOpen(false)}
          expense={expenseToEdit} // Pass the expense to edit if available
        />
      </Modal>
    </div>
  );
};

export default Expenses;
