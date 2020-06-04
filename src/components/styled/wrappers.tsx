import React from 'react';
import styled from 'styled-components';

const StyledInformationWrapper = styled.div`
  width: 60%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  padding-top: 4rem;
  padding-bottom: 1rem;
`;

export const InformationWrapper = ({ children, ...rest }: any) => (
  <StyledInformationWrapper {...rest}>{children}</StyledInformationWrapper>
);

const StyledProgressWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2rem;
`;

export const ProgressWrapper = ({ children, ...rest }: any) => (
  <StyledProgressWrapper {...rest}>{children}</StyledProgressWrapper>
);
