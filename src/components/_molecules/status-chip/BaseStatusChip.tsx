import { Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface StatusChipProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export const BaseStatusChip = ({ children, sx }: StatusChipProps) => {
  return (
    <Box
      sx={{
        width: 'fit-content',
        height: 'fit-content',
        display: 'flex',
        gap: '0.2rem',
        alignItems: 'center',
        p: '0.25rem 0.75rem 0.25rem 0.5rem',
        borderRadius: '1rem',
        bgcolor: 'info.light',
        ...sx,
      }}>
      {children}
    </Box>
  );
};
