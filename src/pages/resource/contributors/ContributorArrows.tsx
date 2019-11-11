import React from 'react';
import styled from 'styled-components';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import { ARROW_DOWN, ARROW_UP } from '../../../utils/constants';

const StyledArrows = styled.div`
  display: grid;
  grid-template-areas: 'arrows-up arrows-down';
`;

const StyledArrowUp = styled(ArrowDropUpIcon)`
  grid-area: arrows-up;
  padding: 0;
  margin: 0;
`;

const StyledArrowDown = styled(ArrowDropDownIcon)`
  grid-area: arrows-down;
  padding: 0;
  margin: 0;
`;

interface ContributorArrowsProps {
  id: string;
  moveContributor: (id: string, direction: number) => void;
}

const ContributorArrows: React.FC<ContributorArrowsProps> = ({ id, moveContributor }) => {
  return (
    <StyledArrows>
      <StyledArrowUp onClick={() => moveContributor(id, ARROW_UP)} />
      <StyledArrowDown onClick={() => moveContributor(id, ARROW_DOWN)} />
    </StyledArrows>
  );
};

export default ContributorArrows;
