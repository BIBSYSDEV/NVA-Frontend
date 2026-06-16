import { Box, CircularProgress, Typography } from '@mui/material';

interface LabeledSpinnerProps {
  label: string;
}

/** An inline spinner shown next to a descriptive label, e.g. while content is loading. */
export const LabeledSpinner = ({ label }: LabeledSpinnerProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <CircularProgress size="1rem" aria-hidden />
    <Typography>{label}</Typography>
  </Box>
);
