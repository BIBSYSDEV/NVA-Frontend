import { Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledLine = styled.div`
  padding-top: 0.8rem;
  display: grid;
  grid-template-areas: 'icon label .' 'text text text';
  grid-template-columns: auto 3fr;
  column-gap: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'icon label' 'text text';
    grid-template-columns: auto 1fr;
  }
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  &:first-of-type {
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
  }
`;

const StyledLabel = styled(Typography)`
  grid-area: label;
  font-weight: bold;
`;

const StyledText = styled(Typography)`
  grid-area: text;
`;

const StyledIcon = styled.div`
  grid-area: icon;
`;

interface IconLabelTextLineProps {
  dataTestId?: string;
  icon: ReactNode;
  label: string;
  text: string;
}

export const IconLabelTextLine = ({ dataTestId, icon, label, text }: IconLabelTextLineProps) => (
  <StyledLine data-testid={dataTestId}>
    <StyledIcon>{icon}</StyledIcon>
    <StyledLabel variantMapping={{ body1: 'h3' }}>{label}</StyledLabel>
    <StyledText gutterBottom>{text}</StyledText>
  </StyledLine>
);
