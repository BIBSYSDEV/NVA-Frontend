import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLine = styled.div`
  padding-bottom: 0.5rem;
`;

const StyledLabel = styled.div`
  display: inline-block;
  width: 10rem;
`;

const StyledText = styled.div`
  display: inline-block;
  width: 30rem;
  font-weight: bold;
`;

interface LabelTextLineProps {
  label: string;
  text: string;
  dataTestId?: string;
  internalLink?: string;
  externalLink?: string;
}

const LabelTextLine: React.FC<LabelTextLineProps> = ({ label, text, dataTestId, internalLink, externalLink }) => (
  <StyledLine>
    <StyledLabel>{label}:</StyledLabel>
    {externalLink && (
      <a href={externalLink}>
        <StyledText data-testid={dataTestId}>{text}</StyledText>
      </a>
    )}
    {internalLink && (
      <Link to={internalLink}>
        <StyledText data-testid={dataTestId}>{text}</StyledText>
      </Link>
    )}
    {!(internalLink || externalLink) && <StyledText data-testid={dataTestId}>{text}</StyledText>}
  </StyledLine>
);

export default LabelTextLine;
