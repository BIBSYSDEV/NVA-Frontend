import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card } from '@material-ui/core';

const StyledUserCard = styled(Card)`
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
  align-items: center;
`;

const StyledSubHeading = styled.div`
  font-size: 1.3rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding-bottom: 1.5rem;
  }
`;

const StyledIcon = styled.div`
  display: inline-flex;
  height: 2.5rem;
  width: 4.5rem;
  margin-left: -1rem;
`;

interface UserCardProps {
  headingLabel: string;
  headingIcon?: ReactNode;
  headingButton?: ReactNode;
  alternativeText?: string;
  subHeadingLabel?: string;
  children?: ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ headingLabel, headingIcon, subHeadingLabel, children }) => (
  <StyledUserCard variant="outlined">
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
