import React from 'react';
import { Link } from 'react-router-dom';
import MuiLink from '@material-ui/core/Link';
import styled from 'styled-components';

const StyledLine = styled.div`
  padding-bottom: 0.5rem;
`;

const StyledLabel = styled.div`
  display: inline-block;
  width: 10rem;
`;

const StyledText = styled.div`
  display: inline-block;
  width: 10rem;
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
      <MuiLink href={externalLink} target="_blank" rel="noopener noreferrer">
        <StyledText data-testid={dataTestId}>{text}</StyledText>
      </MuiLink>
    )}
    {internalLink && (
      <MuiLink component={Link} to={internalLink}>
        <StyledText data-testid={dataTestId}>{text}</StyledText>
      </MuiLink>
    )}
    {!(internalLink || externalLink) && <StyledText data-testid={dataTestId}>{text}</StyledText>}
  </StyledLine>
);

export default LabelTextLine;
