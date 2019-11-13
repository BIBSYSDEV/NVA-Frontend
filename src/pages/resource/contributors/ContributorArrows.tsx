import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ContributorType, { Direction } from '../../../types/contributor.types';
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
      <StyledUpArrow>
        <ArrowDropUpIcon onClick={() => onMoveContributor(contributor, Direction.ARROW_UP)} />
      </StyledUpArrow>
      <StyledDownArrow>
        <ArrowDropDownIcon onClick={() => onMoveContributor(contributor, Direction.ARROW_DOWN)} />
      </StyledDownArrow>
    </StyledContributorArrows>
  );
};

export default ContributorArrows;
