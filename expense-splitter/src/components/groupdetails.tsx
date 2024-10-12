import React, { act, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/GroupDetails.css";
import SearchBar from "./SearchBar";
import Expenses from "./Expenses";
import Summary from "./Summary"; // New Summary component
import { getFromLocalStorage } from "../utils/StorageService";
import ParticipantsList from "./ParticipantsList";

interface Group {
  id: number;
  groupName: string;
  description: string;
  budget: number;
}

const GroupDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string | undefined }>();
  const [foundGroup, setFoundGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState("expenses");
  const handleGoBack = () => {
    navigate("/groups"); // Navigate to /groups route
  };

  useEffect(() => {
    const storedGroups: Group[] = getFromLocalStorage("groups") || [];
    const group = storedGroups.find(
      (g: Group) => g.id === parseInt(id || "", 10)
    );
    setFoundGroup(group || null);
  }, [id]);

  return (
    <div className="group-details-container">
      <div className="layout-content">
        <div className="group-header">
          <p className="group-title">
            {foundGroup ? foundGroup.groupName : "Group Details"}
          </p>
          <button className="settle-button" onClick={handleGoBack}>
            <span className="button-text">Go Back</span>
          </button>
        </div>
        <h3 className="group-description-header">{foundGroup?.description}</h3>
        <p className="group-description">
          {foundGroup ? `· $${foundGroup.budget} budget ` : ""}
        </p>
        <div className="tab-container">
          <div className="tab-header">
            <a
              className={`tab-item ${
                activeTab === "participants" ? "tab-active" : "tab-inactive"
              }`}
              onClick={() => setActiveTab("participants")}
            >
              <p className="tab-text">Participants</p>
            </a>
            <a
              className={`tab-item ${
                activeTab === "expenses" ? "tab-active" : "tab-inactive"
              }`}
              onClick={() => setActiveTab("expenses")}
            >
              <p className="tab-text">Expenses</p>
            </a>
            <a
              className={`tab-item ${
                activeTab === "summary" ? "tab-active" : "tab-inactive"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              <p className="tab-text">Summary</p>
            </a>
          </div>
        </div>

        {/* Conditional rendering for tabs */}
        {activeTab === "participants" &&
          (foundGroup ? (
            <ParticipantsList groupId={foundGroup.id} />
          ) : (
            <p>Loading participant...</p>
          ))}
        {
          activeTab === "expenses" &&
            (foundGroup ? (
              <Expenses groupId={foundGroup.id} />
            ) : (
              <p>Loading expenses...</p>
            ))
          // Ensure groupId is passed
        }
        {
          activeTab === "summary" &&
            (foundGroup ? (
              <Summary groupId={foundGroup.id} />
            ) : (
              <p>Loading Summary...</p>
            ))
          // Ensure groupId is passed
        }
      </div>
    </div>
  );
};

export default GroupDetails;
