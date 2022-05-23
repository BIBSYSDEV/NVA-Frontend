import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const StyledRightAlignedWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const StyledSelectWrapper = styled(Box)(({ theme }) => ({
  width: '50%',
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const SyledPageContent = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.up('sm')]: {
    padding: '1rem 2rem',
  },
  padding: '0.5rem',
}));

export const InputContainerBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const BackgroundDiv = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    padding: '0.5rem',
  },
  padding: '1rem 2rem',
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
