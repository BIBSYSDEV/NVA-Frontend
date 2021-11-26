import styled from 'styled-components';
import { Card as MaterialCard, CardProps } from '@mui/material';

const StyledCard = styled(MaterialCard)`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 2rem;
  }
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

export const Card = ({ children, ...props }: CardProps) => (
  <StyledCard variant="outlined" {...props}>
    {children}
  </StyledCard>
);
