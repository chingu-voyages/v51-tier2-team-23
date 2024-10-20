import React, { useEffect, useState } from "react";
import Card from "./graphs/Card";
import LineGraph from "./graphs/LineGraph";
import BarGraph from "./graphs/BarGraph";
import { getFromLocalStorage } from "../utils/StorageService";
import "../styles/Analytics.css";

interface Participant {
  name: string;
  contribution: string;
  avatarUrl: string;
  weight: number;
}

interface Expense {
  id: number;
  title: string;
  amount: string; // Keep amount as string for parsing
  currency: string;
  description: string;
  participants: Participant[];
  groupId: number; // Group ID to link expense to a group
  receipt: string | null;
  date: string; // Date as string
  category: string; // Add category to Expense interface
}

interface Group {
  id: number; // Unique ID for each group
  groupName: string;
  imageUrl: string;
  totalExpenses: number; // Add totalExpenses to Group interface
  expensesCount: number; // Add expensesCount to Group interface
}

const Analytics: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    { amount: number; date: string }[]
  >([]);
  const [categoryExpenses, setCategoryExpenses] = useState<
    { category: string; amount: number }[]
  >([]);

  useEffect(() => {
    const storedGroups: Group[] = getFromLocalStorage("groups") || [];
    const updatedGroups = storedGroups.map((group) => {
      const storedExpenses: Expense[] = getFromLocalStorage("expenses") || [];
      const groupExpenses = storedExpenses.filter(
        (expense) => expense.groupId === group.id
      );

      const totalExpenses = groupExpenses.reduce(
        (acc: number, expense: Expense) => {
          const expenseAmount = parseFloat(expense.amount) || 0;
          return acc + expenseAmount;
        },
        0
      );

      const expensesCount = groupExpenses.length;
      return { ...group, totalExpenses, expensesCount };
    });

    setGroups(updatedGroups);

    // Get all expenses from all groups
    const allExpenses: Expense[] = updatedGroups.flatMap((group) => {
      return getFromLocalStorage("expenses").filter(
        (expense: { groupId: number }) => expense.groupId === group.id
      );
    });

    // Create a mapping of dates to their maximum expenses
    const dateMap: { [key: string]: number } = {};
    const categoryMap: { [key: string]: number } = {};

    allExpenses.forEach((expense) => {
      if (expense.date) {
        // Check if date exists
        const dateString = expense.date;
        // If the date already exists, take the maximum expense
        dateMap[dateString] = Math.max(
          dateMap[dateString] || 0,
          parseFloat(expense.amount) || 0
        );
      } else {
        console.warn("Invalid expense date:", expense);
      }

      // Aggregate expenses by category
      if (expense.category) {
        categoryMap[expense.category] =
          (categoryMap[expense.category] || 0) +
          (parseFloat(expense.amount) || 0);
      }
    });

    // Convert dateMap to an array for the graph
    const formattedMonthlyExpenses = Object.entries(dateMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("/").map(Number);
        const [dayB, monthB, yearB] = b.date.split("/").map(Number);
        return (
          new Date(yearA, monthA - 1, dayA).getTime() -
          new Date(yearB, monthB - 1, dayB).getTime()
        );
      });

    // Prepare category expenses for BarGraph
    const formattedCategoryExpenses = Object.entries(categoryMap).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );

    // Set the state
    setMonthlyExpenses(formattedMonthlyExpenses);
    setCategoryExpenses(formattedCategoryExpenses);
  }, []);

  // Calculate total expenses, total groups, and average expense
  const totalExpenses = groups.reduce(
    (sum, group) => sum + group.totalExpenses,
    0
  );
  const totalGroups = groups.length;
  const averageExpense = totalGroups > 0 ? totalExpenses / totalGroups : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {" "}
        {/* Added container for scrolling */}
        <h1 className="dashboard-title">Expense Dashboard</h1>
        <p className="dashboard-subtitle">
          Overview of your spending and groups
        </p>
        <div className="layout-container">
          <div className="content-container">
            <div className="card-grid">
              <Card
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152ZM240,56H16a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H240a8,8,0,0,0,8-8V64A8,8,0,0,0,240,56ZM193.65,184H62.35A56.78,56.78,0,0,0,24,145.65v-35.3A56.78,56.78,0,0,0,62.35,72h131.3A56.78,56.78,0,0,0,232,110.35v35.3A56.78,56.78,0,0,0,193.65,184ZM232,93.37A40.81,40.81,0,0,1,210.63,72H232ZM45.37,72A40.81,40.81,0,0,1,24,93.37V72ZM24,162.63A40.81,40.81,0,0,1,45.37,184H24ZM210.63,184A40.81,40.81,0,0,1,232,162.63V184Z" />
                  </svg>
                }
                title="Total Expenses"
                subtitle={`$${totalExpenses.toFixed(2)} spent this month`}
              />
              <Card
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" />
                  </svg>
                }
                title="Total Groups"
                subtitle={`${totalGroups} total groups`}
              />
              <Card
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152ZM240,56H16a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H240a8,8,0,0,0,8-8V64A8,8,0,0,0,240,56ZM193.65,184H62.35A56.78,56.78,0,0,0,24,145.65v-35.3A56.78,56.78,0,0,0,62.35,72h131.3A56.78,56.78,0,0,0,232,110.35v35.3A56.78,56.78,0,0,0,193.65,184ZM232,93.37A40.81,40.81,0,0,1,210.63,72H232ZM45.37,72A40.81,40.81,0,0,1,24,93.37V72ZM24,162.63A40.81,40.81,0,0,1,45.37,184H24ZM210.63,184A40.81,40.81,0,0,1,232,162.63V184Z" />
                  </svg>
                }
                title="Average Expense"
                subtitle={`$${averageExpense.toFixed(2)} average per expense`}
              />
            </div>

            <div className="scrollable-graph-container">
              {" "}
              {/* This can be removed */}
              <div className="graph-container">
                <h2 className="graph-title">Monthly Expense Trends</h2>
                <LineGraph expenses={monthlyExpenses} />
                <h2 className="graph-title">Expenses by Category</h2>
                <BarGraph expenses={categoryExpenses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
