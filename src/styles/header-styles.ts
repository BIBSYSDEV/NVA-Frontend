import { Box, styled } from '@mui/material';

export const PrimaryColoredBox = styled(Box)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  padding: '1rem',
}));
