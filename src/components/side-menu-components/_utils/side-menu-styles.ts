import { Box, styled } from '@mui/material';

export const StyledPageWithSideMenu = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gap: '1rem',
  padding: '1rem',

  gridTemplateColumns: 'auto 1fr',
  [theme.breakpoints.down('md')]: {
    padding: 0,
    gridTemplateColumns: '1fr',
    marginTop: '1px',
  },
}));
