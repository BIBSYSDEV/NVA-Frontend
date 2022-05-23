import { Box, CircularProgress, CircularProgressProps } from '@mui/material';

export const PageSpinner = (props: CircularProgressProps) => (
  <Box sx={{ margin: '5rem 0', display: 'flex', justifyContent: 'center' }}>
    <CircularProgress size={50} {...props} />
  </Box>
);
