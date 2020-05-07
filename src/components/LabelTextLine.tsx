import React, { ReactNode, FC } from 'react';
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

const LabelTextLine: FC<LabelTextLineProps> = ({
  label,
  children,
  dataTestId,
  externalLink,
  internalLink,
  linkText,
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
    {children && <StyledContent data-testid={dataTestId}>{children}</StyledContent>}
  </StyledLine>
);

export default LabelTextLine;
