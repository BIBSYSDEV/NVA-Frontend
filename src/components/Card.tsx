import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card as materialCard } from '@material-ui/core';

const StyledCard = styled(materialCard)`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 2rem;
  }
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, ...props }) => (
  <StyledCard variant="outlined" {...props}>
    {children}
  </StyledCard>
);

export default Card;
