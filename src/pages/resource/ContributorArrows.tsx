import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

interface ContributorArrowsProps {
  id: string;
  onClickUp: (event: React.MouseEvent<any>, id: string) => void;
  onClickDown: (event: React.MouseEvent<any>, id: string) => void;
}

const ContributorArrows: React.FC<ContributorArrowsProps> = ({ id, onClickUp, onClickDown}) => {
  return (
    <div className="arrows">
      <div className="arrows-up">
        <ArrowDropUpIcon onClick={event => onClickUp(event, id)}/>
      </div>
      <div className="arrows-down" onClick={event => onClickDown(event, id)}>
        <ArrowDropDownIcon />
      </div>
    </div>
  );
};

export default ContributorArrows;
