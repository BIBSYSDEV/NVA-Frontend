import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, BoxProps, Typography } from '@mui/material';

interface PendingFilesInfoProps extends Pick<BoxProps, 'sx'> {
  text: string;
}

export const PendingFilesInfo = ({ text, sx }: PendingFilesInfoProps) => (
  <Box
    sx={{
      bgcolor: 'secondary.dark',
      padding: '0.25rem 0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      ...sx,
    }}>
    <HourglassEmptyIcon fontSize="small" />
    <Typography>{text}</Typography>
  </Box>
);
