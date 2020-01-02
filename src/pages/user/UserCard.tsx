import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledUserCard = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 2rem;
  }
  padding: 0.5rem;
`;

const StyledHeading = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  padding-bottom: 0.5rem;
`;

const StyledSubHeading = styled.div`
  font-size: 1.3rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding-bottom: 1.5rem;
  }
`;

interface UserCardProps {
  headerLabel: string;
  subHeaderLabel?: string;
  children?: ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ headerLabel, subHeaderLabel, children }) => (
  <StyledUserCard>
    <StyledHeading>{headerLabel}</StyledHeading>
    {subHeaderLabel && <StyledSubHeading>{subHeaderLabel}</StyledSubHeading>}
    {children}
  </StyledUserCard>
);

export default UserCard;
