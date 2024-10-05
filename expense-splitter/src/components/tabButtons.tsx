import React from "react";

interface Props {
  changeTab: Function;
  activeTab: string;
}

const TabButtons: React.FC<Props> = ({ activeTab, changeTab }) => {
  return (
    <div>
      <div className="tab-buttons">
        <button
          onClick={() => changeTab("tab1")}
          className={activeTab === "tab1" ? "tab active" : "tab"}
        >
          Participants
        </button>
        <button
          onClick={() => changeTab("tab2")}
          className={activeTab === "tab2" ? "tab active" : "tab"}
        >
          Expenses
        </button>
        <button
          onClick={() => changeTab("tab3")}
          className={activeTab === "tab3" ? "tab active" : "tab"}
        >
          Summary
        </button>
      </div>
      <hr />
    </div>
  );
};

export default TabButtons;
