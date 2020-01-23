import React from 'react';
import styled from 'styled-components';

const StyledLine = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
`;

const StyledLabel = styled.div`
  display: inline-block;
  min-width: 15rem;
`;

const StyledText = styled.div`
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

const LabelContentLine: React.FC<LabelTextLineProps> = ({ label, children, dataTestId }) => {
  return (
    <StyledLine data-testid={dataTestId}>
      <StyledLabel>{label}:</StyledLabel>
      <StyledText>{children}</StyledText>
    </StyledLine>
  );
};

export default LabelContentLine;
