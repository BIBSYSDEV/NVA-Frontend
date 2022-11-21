import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const StyledRightAlignedWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const StyledSelectWrapper = styled(Box)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
}));

export const SyledPageContent = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.up('sm')]: {
    padding: '1rem 2rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0.5rem',
  },
}));

export const InputContainerBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const BackgroundDiv = styled(Box)(({ theme }) => ({
  background: theme.palette.secondary.main,
  [theme.breakpoints.up('md')]: {
    padding: '1rem 2rem',
  },
  [theme.breakpoints.down('md')]: {
    padding: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0.5rem',
  },
}));

export const StyledGeneralInfo = styled('div')(({ theme }) => ({
  marginBottom: '1rem',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '1rem',

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const StyledCenterContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
});
