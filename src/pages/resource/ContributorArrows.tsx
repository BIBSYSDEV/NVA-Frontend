import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

interface ContributorArrowsProps {
  id: string;
  onClickUp: (id: string) => void;
  onClickDown: (id: string) => void;
}

const ContributorArrows: React.FC<ContributorArrowsProps> = ({ id, onClickUp, onClickDown }) => {
  return (
    <div className="arrows">
      <div className="arrows-up">
        <ArrowDropUpIcon onClick={() => onClickUp(id)} />
      </div>
      <div className="arrows-down" onClick={() => onClickDown(id)}>
        <ArrowDropDownIcon />
      </div>
    </div>
  );
};

export default ContributorArrows;
