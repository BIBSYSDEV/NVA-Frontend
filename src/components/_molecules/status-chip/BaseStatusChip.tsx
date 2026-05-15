// import BlockIcon from '@mui/icons-material/Block';
// import CheckIcon from '@mui/icons-material/Check';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface StatusChipProps {
  children: ReactNode;
  bgcolor?: string;
  paddingY?: string | number;
}

export const BaseStatusChip = ({ children, bgcolor = 'info.light', paddingY }: StatusChipProps) => {
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
        bgcolor,
        paddingY,
      }}>
      {children}
    </Box>
  );
};
