import { Box, styled } from '@mui/material';

export const FormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.secondary.light,
  padding: '1.75rem 1.25rem',
  gap: '1.5rem',
  borderRadius: '0.25rem',
}));
