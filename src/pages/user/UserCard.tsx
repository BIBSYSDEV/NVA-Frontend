import React, { ReactNode } from 'react';
import { StyledCardContent, StyledHeader, StyledSubHeader, StyledUserCard } from './UserCard.styles';

interface UserCardProps {
  headerLabel: string;
  subHeaderLabel?: string;
  children?: ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ headerLabel, subHeaderLabel, children }) => (
  <StyledUserCard>
    <StyledHeader>{headerLabel}</StyledHeader>
    {subHeaderLabel && <StyledSubHeader>{subHeaderLabel}</StyledSubHeader>}
    {children && <StyledCardContent>{children}</StyledCardContent>}
  </StyledUserCard>
);

export default UserCard;
