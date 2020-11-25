import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledRow = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8rem;
  align-items: center;
`;

const StyledLabel = styled(({ minimal: boolean, ...props }) => <Typography {...props} />)`
  display: inline-block;
  font-weight: bold;
  ${({ minimal }) => (minimal ? `width: 10rem;` : `min-width: 17rem;`)}
`;

const StyledSingleRowContainer = styled(Typography)`
  display: inline-block;
  flex: 1;
`;

const StyledMultipleRowContainer = styled.div`
  display: inline-block;
  flex: 1;
`;

interface LabelContentRowProps {
  label: string;
  children: ReactNode;
  dataTestId?: string;
  minimal?: boolean;
  multiple?: boolean;
}

const LabelContentRow: FC<LabelContentRowProps> = ({ label, children, dataTestId, multiple, minimal = false }) => (
  <StyledRow data-testid={dataTestId}>
    <StyledLabel minimal={minimal}>{label}</StyledLabel>
    {multiple ? (
      <StyledMultipleRowContainer>{children}</StyledMultipleRowContainer>
    ) : (
      <StyledSingleRowContainer>{children}</StyledSingleRowContainer>
    )}
  </StyledRow>
);

export default LabelContentRow;
