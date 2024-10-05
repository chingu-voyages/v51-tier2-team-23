import React from "react";
import Button from "./button";

interface Props {
  name: string;
  date: string;
  onButtonClick: Function;
}

const Header: React.FC<Props> = ({ name, date, onButtonClick }) => {
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
            <li className="list__item">7 people</li>
            <li className="list__item">$5,0000</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
