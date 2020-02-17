import React from 'react';
import styled from 'styled-components';
import Label from './Label';
import NormalText from './NormalText';

const StyledRow = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8rem;
`;

const StyledLabel = styled(NormalText)`
  display: inline-block;
  min-width: 15rem;
  font-weight: normal;
`;

const StyledText = styled(NormalText)`
  display: inline-block;
  font-weight: bold;
  flex: 1;
  min-width: 60%;
`;

interface LabelTextLineProps {
  label: string;
  children: any;
  dataTestId?: string;
}

const LabelContentRow: React.FC<LabelTextLineProps> = ({ label, children, dataTestId }) => {
  return (
    <StyledRow data-testid={dataTestId}>
      <StyledLabel>{label}</StyledLabel>
      <StyledText>{children}</StyledText>
    </StyledRow>
  );
};

export default LabelContentRow;
