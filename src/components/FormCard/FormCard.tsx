import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card } from '@material-ui/core';

const StyledCard = styled(Card)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 2rem 1rem 2rem;
  }
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

interface UserCardProps {
  children: ReactNode;
}

const FormCard: React.FC<UserCardProps> = ({ children, ...props }) => (
  <StyledCard variant="outlined" {...props}>
    {children}
  </StyledCard>
);

export default FormCard;
