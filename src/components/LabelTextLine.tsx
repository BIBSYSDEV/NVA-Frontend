import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';
import styled from 'styled-components';

const StyledLine = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
`;

const StyledLabel = styled(Typography)`
  width: 6rem;
  min-width: 6rem;
`;

const StyledContent = styled.div`
  flex: 1;
`;

interface LabelTextLineProps {
  label: string;
  children?: ReactNode;
  dataTestId?: string;
}

export const LabelTextLine = ({ label, children, dataTestId }: LabelTextLineProps) => (
  <StyledLine>
    <StyledLabel>{label}:</StyledLabel>
    {children && <StyledContent data-testid={dataTestId}>{children}</StyledContent>}
  </StyledLine>
);
