import { Box, styled } from '@mui/material';

export const FormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  padding: '1.75rem 1.25rem',
  gap: '1rem',
  borderRadius: '0.25rem',
}));
