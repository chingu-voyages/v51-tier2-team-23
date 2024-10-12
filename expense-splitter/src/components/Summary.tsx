import React, { useState, useEffect } from "react";
import "../styles/Summary.css";
import { getFromLocalStorage } from "../utils/StorageService";

interface Participant {
  name: string;
  contribution: string; // Contribution amount
  avatarUrl: string;
  weight: number; // Weight of contribution for split
}

interface Expense {
  id: number;
  title: string;
  amount: number | string; // Total expense amount
  participants: Participant[];
  groupId: number;
  date: string; // Date of the expense
}

interface SummaryProps {
  groupId: number;
}

const Summary: React.FC<SummaryProps> = ({ groupId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expandedExpenseId, setExpandedExpenseId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (groupId) {
      const storedExpenses: Expense[] = getFromLocalStorage("expenses") || [];
      const groupExpenses = storedExpenses.filter(
        (expense) => expense.groupId === groupId
      );
      setExpenses(groupExpenses);
    }
  }, [groupId]);

  const toggleExpense = (expenseId: number) => {
    setExpandedExpenseId((prev) => (prev === expenseId ? null : expenseId));
  };

  const calculateParticipantData = (expense: Expense) => {
    const totalWeight = expense.participants.reduce(
      (acc, participant) => acc + participant.weight,
      0
    );
    const totalAmount = parseFloat(String(expense.amount)) || 0;

    return expense.participants.map((participant) => {
      const weightRatio =
        totalWeight > 0 ? participant.weight / totalWeight : 0;
      const owedAmount = weightRatio * totalAmount; // Amount each participant should pay based on weight
      const contribution = parseFloat(participant.contribution) || 0; // Ensure contribution is a number

      const isOwed =
        contribution > owedAmount
          ? (contribution - owedAmount).toFixed(2)
          : "0.00"; // Amount the participant should receive back
      const owed =
        contribution < owedAmount
          ? (owedAmount - contribution).toFixed(2)
          : "0.00"; // Amount they still need to contribute

      return {
        ...participant,
        owedAmount: owed, // Total amount owed based on contribution
        isOwed, // Amount owed to the participant (must be non-negative)
      };
    });
  };

  return (
    <div className="summary-container">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className={`expense-item1 ${
            expandedExpenseId === expense.id ? "expanded" : ""
          }`}
          onClick={() => toggleExpense(expense.id)}
        >
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
                ${parseFloat(String(expense.amount)).toFixed(2)} · Participants:{" "}
                {expense.participants.length} · Date:{" "}
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div
              className={`expense-arrow ${
                expandedExpenseId === expense.id ? "rotated" : ""
              }`}
            >
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
          {expandedExpenseId === expense.id && (
            <div className="participant-table">
              <header className="table-header">
                <div className="header-row">
                  {["Participant", "Weight(%)", "Paid", "Owed", "Is Owed"].map(
                    (header, idx) => (
                      <div key={idx} className="header-cell">
                        {header}
                      </div>
                    )
                  )}
                </div>
              </header>
              <div className="table-body">
                {calculateParticipantData(expense).map((participant, index) => (
                  <div key={index} className="body-row">
                    <div className="body-cell">{participant.name}</div>
                    <div className="body-cell">{participant.weight}</div>
                    <div className="body-cell">
                      ${(parseFloat(participant.contribution) || 0).toFixed(2)}
                    </div>
                    <div className="body-cell">${participant.owedAmount}</div>
                    <div className="body-cell">${participant.isOwed}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Summary;
