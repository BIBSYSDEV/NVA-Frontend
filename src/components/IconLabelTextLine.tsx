import React from 'react';

import { Icon } from '@material-ui/core';
import styled from 'styled-components';

interface IconLabelTextLineProps {
  dataTestId?: string;
  icon: string;
  label: string;
  text: string;
}

const StyledLine = styled.div`
  padding-bottom: 0.8rem;
  padding-top: 0.8rem;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.palette.li};
  &:first-of-type {
    border-top: 1px solid ${({ theme }) => theme.palette.separator.main};
  }
`;

const StyledLabel = styled.div`
  font-weight: bold;
  width: 6rem;
`;
const StyledText = styled.div`
  width: 20rem;
`;

const StyledIcon = styled(Icon)`
  width: 3rem;
`;

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
