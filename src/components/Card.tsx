import React, { FC } from 'react';
import styled from 'styled-components';
import { Card as MaterialCard, CardProps } from '@material-ui/core';

const StyledCard = styled(MaterialCard)`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 2rem;
  }
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const Card: FC<CardProps> = ({ children, ...props }) => (
  <StyledCard variant="outlined" {...props}>
    {children}
  </StyledCard>
);

export default Card;
