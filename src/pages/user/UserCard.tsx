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
  display: flex;
`;

const StyledSubHeading = styled.div`
  font-size: 1.3rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding-bottom: 1.5rem;
  }
`;

const StyledIcon = styled.div`
  padding-right: 0.5rem;
  padding-top: 0.2rem;
`;

interface UserCardProps {
  headingLabel: string;
  headingIcon?: ReactNode;
  alternativeText?: string;
  subHeadingLabel?: string;
  children?: ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ headingLabel, headingIcon, subHeadingLabel, children }) => (
  <StyledUserCard>
    <StyledHeading>
      <>
        {headingIcon && <StyledIcon>{headingIcon}</StyledIcon>}
        {headingLabel}
      </>
    </StyledHeading>
    {subHeadingLabel && <StyledSubHeading>{subHeadingLabel}</StyledSubHeading>}
    {children}
  </StyledUserCard>
);

export default UserCard;
