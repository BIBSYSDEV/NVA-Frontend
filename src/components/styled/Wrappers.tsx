import React, { FC } from 'react';
import styled from 'styled-components';
import NormalText from '../NormalText';

const StyledInformationWrapper = styled.div`
  width: 60%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  padding-top: 4rem;
  padding-bottom: 1rem;
`;

export const InformationWrapper: FC = ({ children, ...props }: any) => (
  <StyledInformationWrapper {...props}>{children}</StyledInformationWrapper>
);

const StyledProgressWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2rem;
`;

export const ProgressWrapper: FC = ({ children, ...props }: any) => (
  <StyledProgressWrapper {...props}>{children}</StyledProgressWrapper>
);

const StyledRightAlignedButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const RightAlignedButtonWrapper: FC = ({ children, ...props }: any) => (
  <StyledRightAlignedButtonWrapper {...props}>{children}</StyledRightAlignedButtonWrapper>
);

const StyledNormalTextPreWrapped = styled(NormalText)`
  white-space: pre-wrap;
`;

export const NormalTextPreWrapped: FC = ({ children, ...props }: any) => (
  <StyledNormalTextPreWrapped {...props}>{children}</StyledNormalTextPreWrapped>
);
