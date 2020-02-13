import React from 'react';
import styled from 'styled-components';
import NormalText from './NormalText';

const StyledRow = styled.div`
  padding-bottom: 0.5rem;
`;

const StyledLabel = styled(NormalText)`
  display: inline;
  font-weight: bold;
`;
const StyledText = styled(NormalText)`
  display: inline;
`;

interface LabelTextLineProps {
  label: string;
  children: any;
  dataTestId?: string;
}

const LabelContentRowForPublicationPage: React.FC<LabelTextLineProps> = ({ label, children, dataTestId }) => {
  return (
    <StyledRow data-testid={dataTestId}>
      <StyledLabel>{label}: </StyledLabel>
      <StyledText>{children}</StyledText>
    </StyledRow>
  );
};

export default LabelContentRowForPublicationPage;
