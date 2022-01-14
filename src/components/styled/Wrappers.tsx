import { styled } from '@mui/system';

export const StyledRightAlignedWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const StyledSelectWrapper = styled('div')(({ theme }) => ({
  width: '50%',
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const SyledPageContent = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.up('sm')]: {
    padding: '1rem 2rem',
  },
  padding: '0.5rem',
}));

export const InputContainerBox = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});
