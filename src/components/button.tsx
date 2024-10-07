import React from "react";

interface Props {
  name: string;
  className: string;
  onButtonClick: Function;
}

const Button: React.FC<Props> = ({ name, className, onButtonClick }) => {
  return (
    <button onClick={() => onButtonClick()} className={className}>
      {name}
    </button>
  );
};

export default Button;
