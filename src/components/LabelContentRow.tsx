import React from 'react';
import styled from 'styled-components';
import NormalText from './NormalText';

const StyledRow = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8rem;
`;

const StyledLabel = styled(NormalText)`
  display: inline-block;
  min-width: 17rem;
  font-weight: bold;
`;

const StyledSingleRowContainer = styled(NormalText)`
  display: inline-block;
  flex: 1;
  min-width: 60%;
`;

const StyledMultipleRowContainer = styled.div`
  display: inline-block;
  flex: 1;
  min-width: 60%;
`;

interface LabelContentRowProps {
  label: string;
  children: any;
  dataTestId?: string;
  multiple?: boolean;
}

const LabelContentRow: React.FC<LabelContentRowProps> = ({ label, children, dataTestId, multiple }) => {
  return (
    <StyledRow data-testid={dataTestId}>
      <StyledLabel>{label}</StyledLabel>
      {multiple ? (
        <StyledMultipleRowContainer>{children}</StyledMultipleRowContainer>
      ) : (
        <StyledSingleRowContainer>{children}</StyledSingleRowContainer>
      )}
    </StyledRow>
  );
};

export default LabelContentRow;
