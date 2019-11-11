import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { ARROW_UP, ARROW_DOWN } from '../../utils/constants';

interface ContributorArrowsProps {
  id: string;
  moveContributor: (id: string, direction: number) => void;
}

const ContributorArrows: React.FC<ContributorArrowsProps> = ({ id, moveContributor }) => {
  return (
    <div className="arrows">
      <div className="arrows-up">
        <ArrowDropUpIcon onClick={() => moveContributor(id, ARROW_UP)} />
      </div>
      <div className="arrows-down" onClick={() => moveContributor(id, ARROW_DOWN)}>
        <ArrowDropDownIcon />
      </div>
    </div>
  );
};

export default ContributorArrows;
