import { Box, BoxProps } from '@mui/material';
import { styled as muiStyled } from '@mui/system';
import styled from 'styled-components';

export const StyledRightAlignedWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledCenterAlignedContentWrapper = styled.div`
  display: flex;
  justify-content: center;
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

export const SyledPageContent = muiStyled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.up('sm')]: {
    padding: '1rem 2rem',
  },
  padding: '0.5rem',
}));

export const InputContainerBox = (props: BoxProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} {...props} />
);
