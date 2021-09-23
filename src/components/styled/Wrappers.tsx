import { Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledRightAlignedWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledCenterAlignedContentWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledTypographyPreWrapped = styled(Typography)`
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

export const StyledCenteredContent = styled.div`
  margin-top: 4rem;
`;
