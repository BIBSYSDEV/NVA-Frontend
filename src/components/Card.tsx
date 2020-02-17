import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card as materialCard } from '@material-ui/core';

const Card = styled(materialCard)`
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

const StyledCard: React.FC<CardProps> = ({ children, ...props }) => (
  <Card variant="outlined" {...props}>
    {children}
  </Card>
);

export default StyledCard;
