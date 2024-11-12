import { Box, styled } from '@mui/material';

export const ProfileBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.secondary.light,
  padding: '1.75rem 1.25rem',
  borderRadius: '0.25rem',
  mb: { xs: '1rem', lg: 0 },
}));

export const StyledGridBox = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
});
