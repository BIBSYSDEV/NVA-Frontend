import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import styled from 'styled-components';
import NormalText from './NormalText';

const StyledLine = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
`;

const StyledLabel = styled(NormalText)`
  display: inline-block;
  width: 6rem;
  min-width: 6rem;
`;

const StyledContent = styled.div`
  display: inline-block;
  flex: 1;
  min-width: 30rem;
`;

interface LabelTextLineProps {
  label: string;
  linkText?: any;
  dataTestId?: string;
  internalLink?: string;
  externalLink?: string;
  children?: ReactNode;
}

const LabelTextLine: React.FC<LabelTextLineProps> = ({
  label,
  linkText,
  dataTestId,
  internalLink,
  externalLink,
  children,
}) => (
  <StyledLine>
    <StyledLabel>{label}:</StyledLabel>
    {externalLink && (
      <MuiLink href={externalLink} target="_blank" rel="noopener noreferrer">
        <StyledContent data-testid={dataTestId}>
          <NormalText>{linkText ?? externalLink}</NormalText>
        </StyledContent>
      </MuiLink>
    )}
    {internalLink && (
      <MuiLink component={Link} to={internalLink}>
        <StyledContent data-testid={dataTestId}>
          <NormalText>{linkText ?? internalLink}</NormalText>
        </StyledContent>
      </MuiLink>
    )}
    {children && <StyledContent>{children}</StyledContent>}
  </StyledLine>
);

export default LabelTextLine;
