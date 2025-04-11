import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, BoxProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PendingFilesInfoProps extends BoxProps {
  text: string | ReactNode;
}

export const PendingFilesInfo = ({ text, sx, ...rest }: PendingFilesInfoProps) => (
  <Box
    {...rest}
    sx={{
      bgcolor: 'secondary.dark',
      padding: '0.25rem 0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      ...sx,
    }}>
    <HourglassEmptyIcon fontSize="small" />
    {typeof text === 'string' ? <Typography>{text}</Typography> : <div>{text}</div>}
  </Box>
);
