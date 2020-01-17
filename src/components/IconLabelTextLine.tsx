import React from 'react';
import styled from 'styled-components';

import { Icon } from '@material-ui/core';

const StyledLine = styled.div`
  padding-bottom: 0.8rem;
  padding-top: 0.8rem;
  display: grid;
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'icon label' 'text text';
    grid-template-columns: auto 1fr;
  }
  grid-template-areas: 'icon label .' 'text text text';
  grid-template-columns: auto 3fr;
  border-bottom: 1px solid ${({ theme }) => theme.palette.separator.main};
  &:first-of-type {
    border-top: 1px solid ${({ theme }) => theme.palette.separator.main};
  }
`;

const StyledLabel = styled.div`
  grid-area: label;
  font-weight: bold;
`;

const StyledText = styled.div`
  grid-area: text;
`;

const StyledIcon = styled(Icon)`
  grid-area: icon;
  padding-right: 2rem;
`;

interface IconLabelTextLineProps {
  dataTestId?: string;
  icon: string;
  label: string;
  text: string;
}

const IconLabelTextLine: React.FC<IconLabelTextLineProps> = ({ dataTestId, icon, label, text }) => {
  return (
    <StyledLine>
      <StyledIcon>{icon}</StyledIcon>
      <StyledLabel data-testid={dataTestId}>{label}</StyledLabel>
      <StyledText>{text}</StyledText>
    </StyledLine>
  );
};
export default IconLabelTextLine;
