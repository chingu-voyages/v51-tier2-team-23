import React from "react";
import Button from "./button";

interface Props {
  name: string;
  date: string;
  onButtonClick: Function;
  totalExpenses: number;
  numberOfParticipants: number;
}

const Header: React.FC<Props> = ({
  name,
  date,
  onButtonClick,
  totalExpenses,
  numberOfParticipants,
}) => {
  return (
    <div className="header">
      <div className="title">
        <div>
          <h2>{name}</h2>
          <span>Created at {date}</span>
        </div>
        <Button
          name="Settle up"
          onButtonClick={onButtonClick}
          className="btn"
        />
      </div>
      <div className="description">
        <h3>Group description</h3>
        <div>
          <ul className="list list--inline">
            <li className="list__item">{numberOfParticipants} people</li>
            <li className="list__item">${totalExpenses}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
