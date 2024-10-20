import React from "react";
import "../../styles/LineGraph.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineGraphProps {
  expenses: { amount: number; date: string }[];
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{payload[0].payload.name}</p>
        <p className="tooltip-expense">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const LineGraph: React.FC<LineGraphProps> = ({ expenses }) => {
  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedExpenses = expenses.sort(
    (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );

  const data = sortedExpenses.map((expense) => ({
    name: expense.date,
    Expense: expense.amount,
  }));

  return (
    <div className="line-graph">
      <p className="title1">Monthly Expenses</p>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
          >
            <XAxis dataKey="name" tick={{ fill: "#fff" }} />
            <YAxis hide={true} domain={[0, 'dataMax + 10']} /> {/* Hide the Y-axis and set the domain */}
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="Expense"
              stroke="#2e4355" // Chart line color
              strokeWidth={4}
              dot={{
                fill: "#2e4355", // Data point dot fill color
                stroke: "#8884d8", // Data point dot stroke color
                strokeWidth: 2,
                r: 8,
              }}
              activeDot={{
                fill: "#2e4355",
                stroke: "#8884d8",
                strokeWidth: 4,
                r: 10,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineGraph;