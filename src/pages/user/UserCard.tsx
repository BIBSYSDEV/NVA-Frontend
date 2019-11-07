import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledUserCard = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  padding: 2rem;
`;

const StyledHeading = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  padding-bottom: 0.5rem;
`;

const StyledSubHeading = styled.div`
  font-size: 1.3rem;
  padding-bottom: 1.5rem;
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
    {children && <div>{children}</div>}
  </StyledUserCard>
);

export default UserCard;
