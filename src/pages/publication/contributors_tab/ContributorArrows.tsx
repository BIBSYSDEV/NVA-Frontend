import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import styled from 'styled-components';
import StopIcon from '@material-ui/icons/Stop';

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
  index: number;
  first: boolean;
  last: boolean;
  swap: (indexA: number, indexB: number) => void;
}

const ContributorArrows: React.FC<ContributorArrowsProps> = ({ first, last, swap, index }) => {
  return (
    <StyledContributorArrows>
      <StyledUpArrow>
        {(!first && <ArrowDropUpIcon onClick={() => swap(index, index - 1)} />) || <StopIcon />}
      </StyledUpArrow>
      <StyledDownArrow>
        {(!last && <ArrowDropDownIcon onClick={() => swap(index, index + 1)} />) || <StopIcon />}
      </StyledDownArrow>
    </StyledContributorArrows>
  );
};

export default ContributorArrows;
