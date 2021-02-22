import styled from 'styled-components';
import NormalText from '../NormalText';

export const StyledInformationWrapper = styled.div`
  width: 60%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  padding-top: 4rem;
  padding-bottom: 1rem;
`;

export const StyledRightAlignedWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledCenterAlignedContentWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledNormalTextPreWrapped = styled(NormalText)`
  white-space: pre-wrap;
`;

export const StyledSelectWrapper = styled.div`
  width: 50%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0 1rem;
    width: 100%;
  }
`;

export const StyledFlexColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const StyledPageWrapper = styled.div`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 2rem;
  }
  padding: 0.5rem;
`;

export const StyledPageWrapperWithMaxWidth = styled(StyledPageWrapper)`
  max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'};
`;
