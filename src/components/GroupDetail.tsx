import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../utils/StorageService";

interface Expense {
  id: number;
  name: string;
  amount: number;
}

interface Group {
  id: number;
  groupName: string;
  totalExpenses: number;
  amountOwed: number;
  imageUrl: string;
}

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);

  useEffect(() => {
    const storedGroups: Group[] = getFromLocalStorage("groups") || [];
    const foundGroup = storedGroups.find(
      (group) => group.id === parseInt(id || "", 10)
    );

    if (foundGroup) {
      setGroup(foundGroup);
      const storedExpenses: Expense[] =
        getFromLocalStorage(`expenses_${id}`) || [];
      setExpenses(storedExpenses);
    }
  }, [id]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (expenseName.trim() && expenseAmount > 0) {
      const newExpense: Expense = {
        id: Date.now(), // Generate a simple unique ID
        name: expenseName,
        amount: expenseAmount,
      };

      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      saveToLocalStorage(`expenses_${id}`, updatedExpenses);

      // Reset the input fields
      setExpenseName("");
      setExpenseAmount(0);
    }
  };

  return (
    <div>
      {group && (
        <>
          <h1>{group.groupName}</h1>
          <p>Total Expenses: ${group.totalExpenses}</p>
          <p>You Owe: ${group.amountOwed}</p>

          <h2>Add Expense</h2>
          <form onSubmit={handleAddExpense}>
            <input
              type="text"
              placeholder="Expense Name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(Number(e.target.value))}
              required
            />
            <button type="submit">Add Expense</button>
          </form>

          <h2>Expenses</h2>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                {expense.name}: ${expense.amount}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GroupDetail;
