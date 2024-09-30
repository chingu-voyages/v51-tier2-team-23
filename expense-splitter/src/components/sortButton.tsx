import React from "react";

interface Props {
  value: string;
  onChange: Function;
}

const SortButton: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="sort_btn" className="sort-btn--label">
        Sort By
      </label>
      <select
        id="sort_btn"
        className="sort-btn"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      >
        <option value="name">Name</option>
        <option value="budget">Budget</option>
        <option value="dateAdded">Date Added</option>
      </select>
    </div>
  );
};

export default SortButton;
