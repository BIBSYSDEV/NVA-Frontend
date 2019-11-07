import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface UserCardProps {
  headerLabel: string;
  subHeaderLabel?: string;
  children?: ReactNode;
}

const StyledUserCard = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  padding: 2rem;
`;

const StyledHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  padding-bottom: 0.5rem;
`;

const StyledSubHeader = styled.div`
  font-size: 1.3rem;
  padding-bottom: 1.5rem;
`;

const StyledCardContent = styled.div``;

const UserCard: React.FC<UserCardProps> = ({ headerLabel, subHeaderLabel, children }) => (
  <StyledUserCard>
    <StyledHeader>{headerLabel}</StyledHeader>
    {subHeaderLabel && <StyledSubHeader>{subHeaderLabel}</StyledSubHeader>}
    {children && <StyledCardContent>{children}</StyledCardContent>}
  </StyledUserCard>
);

export default UserCard;
