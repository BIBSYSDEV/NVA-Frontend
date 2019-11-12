import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { ARROW_UP, ARROW_DOWN } from '../../../utils/constants';
import ContributorType from '../../../types/contributor.types';

interface ContributorArrowsProps {
  contributor: ContributorType;
  onMoveContributor: (contributor: ContributorType, direction: number) => void;
}

const ContributorArrows: React.FC<ContributorArrowsProps> = ({ contributor, onMoveContributor }) => {

  return (
    <div className="arrows">
      <div className="arrows-up">
        <ArrowDropUpIcon onClick={() => onMoveContributor(contributor, ARROW_UP)} />
      </div>
      <div className="arrows-down" onClick={() => onMoveContributor(contributor, ARROW_DOWN)}>
        <ArrowDropDownIcon />
      </div>
    </div>
  );
};

export default ContributorArrows;
