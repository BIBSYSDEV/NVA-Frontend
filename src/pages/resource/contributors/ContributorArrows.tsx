import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { ARROW_UP, ARROW_DOWN } from '../../../utils/constants';
import ContributorType from '../../../types/contributor.types';
import styled from 'styled-components';

const StyledContributorArrows = styled.div`
  display: grid;
  grid-template-areas: 'arrow-up arrow-down';
`;

const StyledUpArrow = styled.span`
  grid-area: arrow-up;
`;

const StyledDownArrow = styled.span`
  grid-area: arrow-down;
`;

interface ContributorArrowsProps {
  contributor: ContributorType;
  onMoveContributor: (contributor: ContributorType, direction: number) => void;
}

const ContributorArrows: React.FC<ContributorArrowsProps> = ({ contributor, onMoveContributor }) => {
  return (
    <StyledContributorArrows>
      <div className="arrows">
        <StyledUpArrow>
          <ArrowDropUpIcon onClick={() => onMoveContributor(contributor, ARROW_UP)} />
        </StyledUpArrow>
        <StyledDownArrow>
          <ArrowDropDownIcon onClick={() => onMoveContributor(contributor, ARROW_DOWN)} />
        </StyledDownArrow>
      </div>
    </StyledContributorArrows>
  );
};

export default ContributorArrows;
