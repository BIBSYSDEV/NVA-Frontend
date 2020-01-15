import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledBlock = styled.div`
  padding-bottom: 0.5rem;
  display: grid;
`;

const StyledLabel = styled.div`
  display: inline-block;
  width: 10rem;
`;

const StyledText = styled.div`
  width: 10rem;
  font-weight: bold;
`;

interface LabelTextBlockProps {
  label: string;
  text: string;
  dataTestId?: string;
  internalLink?: string;
  externalLink?: string;
}

const LabelTextBlock: React.FC<LabelTextBlockProps> = ({ label, text, dataTestId, internalLink, externalLink }) => (
  <StyledBlock>
    <StyledLabel>{label}:</StyledLabel>
    {externalLink && (
      <a href={externalLink} target="_blank" rel="noopener noreferrer">
        <StyledText data-testid={dataTestId}>{text}</StyledText>
      </a>
    )}
    {internalLink && (
      <Link to={internalLink}>
        <StyledText data-testid={dataTestId}>{text}</StyledText>
      </Link>
    )}
    {!(internalLink || externalLink) && <StyledText data-testid={dataTestId}>{text}</StyledText>}
  </StyledBlock>
);

export default LabelTextBlock;
