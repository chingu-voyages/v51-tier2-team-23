import React from "react";
import "../styles/Groups.css"; // Import the CSS file
import SearchBar from "./SearchBar";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/StorageService";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
}

interface Group {
  id: number; // Unique ID for each group
  groupName: string;
  imageUrl: string;
  totalExpenses: number; // Add totalExpenses to Group interface
  expensesCount: number; // Add expensesCount to Group interface
}

const GroupCard: React.FC<{ group: Group; onDelete: (id: number) => void }> = ({
  group,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/groups/${group.id}`); // Navigate to the group details page
  };

  return (
    <div className="group-card">
      <div className="card-content">
        <div className="text-section">
          <div className="text-group">
            <p className="total-expenses">Total expenses: ${group.totalExpenses.toFixed(2)}</p>
            <p className="title">{group.groupName}</p>
            <p className="amount-owed">Expenses count: {group.expensesCount}</p>
          </div>
          <div className="button-section"> {/* Flex container for buttons */}
            <button className="view-button" onClick={handleViewClick}>
              <span className="truncate">View</span>
            </button>
            <button className="delete-button" onClick={() => onDelete(group.id)}>
              Delete
            </button> {/* Delete button styled like the view button */}
          </div>
        </div>
        <div
          className="image-section"
          style={{ backgroundImage: `url(${group.imageUrl})` }}
        ></div>
      </div>
    </div>
  );
};

const GroupCardList: React.FC = () => {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const navigate = useNavigate();

  const fetchGroups = () => {
    const storedGroups: Group[] = getFromLocalStorage("groups") || [];
    const updatedGroups = storedGroups.map((group) => {
      const storedExpenses: Expense[] = getFromLocalStorage("expenses") || [];
      const groupExpenses = storedExpenses.filter(
        (expense) => expense.groupId === group.id
      );

      const totalExpenses = groupExpenses.reduce((acc: number, expense: Expense) => {
        const expenseAmount = parseFloat(expense.amount) || 0;
        return acc + expenseAmount;
      }, 0);

      const expensesCount = groupExpenses.length;
      return { ...group, totalExpenses, expensesCount };
    });

    setGroups(updatedGroups);
  };

  const addGroup = (newGroup: Group) => {
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    saveToLocalStorage("groups", updatedGroups);
    navigate("/groups"); // Redirect to groups page after adding
  };

  const deleteGroup = (id: number) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (confirmDelete) {
      const updatedGroups = groups.filter(group => group.id !== id);
      setGroups(updatedGroups);
      saveToLocalStorage("groups", updatedGroups);
    }
  };

  // Fetch groups on component mount
  React.useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div>
      <SearchBar />
      <div className="group-list-container"> {/* Added wrapper for scrolling */}
        {groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onDelete={deleteGroup} // Pass the delete function as a prop
            />
          ))
        ) : (
          <p>No groups available.</p>
        )}
      </div>
    </div>
  );
};

export default GroupCardList;
  