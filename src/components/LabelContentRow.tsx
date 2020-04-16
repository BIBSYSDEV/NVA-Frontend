import React from 'react';
import styled from 'styled-components';
import NormalText from './NormalText';

const StyledRow = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8rem;
`;

const StyledLabel = styled(NormalText)<{ minimal: boolean }>`
  display: inline-block;
  font-weight: bold;
  ${({ minimal }) => (minimal ? `padding-right: 1rem;` : `min-width: 17rem;`)}
`;

const StyledSingleRowContainer = styled(NormalText)`
  display: inline-block;
  flex: 1;
`;

const StyledMultipleRowContainer = styled.div`
  display: inline-block;
  flex: 1;
`;

interface LabelContentRowProps {
  label: string;
  children: any;
  dataTestId?: string;
  minimal?: boolean;
  multiple?: boolean;
}

const LabelContentRow: React.FC<LabelContentRowProps> = ({
  label,
  children,
  dataTestId,
  multiple,
  minimal = false,
}) => (
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
