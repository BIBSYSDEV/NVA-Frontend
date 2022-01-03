import { Box, BoxProps } from '@mui/material';

export const BackgroundDiv = ({ children, ...props }: BoxProps) => (
  <Box sx={{ bgcolor: 'background.paper', p: { xs: '0.5rem', sm: '1rem 2rem' } }} {...props}>
    {children}
  </Box>
);
