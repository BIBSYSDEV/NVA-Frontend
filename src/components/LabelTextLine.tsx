import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink, Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledLine = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
`;

const StyledLabel = styled(Typography)`
  width: 6rem;
  min-width: 6rem;
`;

const StyledContent = styled.div`
  flex: 1;
`;

interface LabelTextLineProps {
  label: string;
  children?: ReactNode;
  dataTestId?: string;
  externalLink?: string;
  internalLink?: string;
  linkText?: string;
}

export const LabelTextLine = ({
  label,
  children,
  dataTestId,
  externalLink,
  internalLink,
  linkText,
}: LabelTextLineProps) => (
  <StyledLine>
    <StyledLabel>{label}:</StyledLabel>
    {externalLink && (
      <MuiLink href={externalLink} target="_blank" rel="noopener noreferrer">
        <StyledContent data-testid={dataTestId}>
          <Typography>{linkText ?? externalLink}</Typography>
        </StyledContent>
      </MuiLink>
    )}
    {internalLink && (
      <MuiLink component={Link} to={internalLink}>
        <StyledContent data-testid={dataTestId}>
          <Typography>{linkText ?? internalLink}</Typography>
        </StyledContent>
      </MuiLink>
    )}
    {children && <StyledContent data-testid={dataTestId}>{children}</StyledContent>}
  </StyledLine>
);
