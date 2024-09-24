import ErrorIcon from '@mui/icons-material/Error';
import { Box, BoxProps, Typography } from '@mui/material';

interface SimpleWarningProps extends Pick<BoxProps, 'sx'> {
  text: string;
}

export const SimpleWarning = ({ text, sx }: SimpleWarningProps) => {
  return (
    <Box sx={{ display: 'flex', gap: '0.3rem', alignItems: 'center', ...sx }}>
      <ErrorIcon color="warning" />
      <Typography fontWeight="bold">{text}</Typography>
    </Box>
  );
};
