import React from "react";
import "../../styles/BarGraph.css"; // Import the CSS file

interface BarGraphProps {
  expenses: { category: string; amount: number }[];
}

const BarGraph: React.FC<BarGraphProps> = ({ expenses }) => {
  // Calculate total expenses
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bar-graph">
      <p className="title2">Expenses by Category</p>
      <div className="grid">
        {expenses.map(({ category, amount }) => (
          <React.Fragment key={category}>
            <p className="category">{category}</p>
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: totalExpenses > 0 ? `${(amount / totalExpenses) * 100}%` : "0%" }} // Calculate the width based on the total
              ></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BarGraph;
