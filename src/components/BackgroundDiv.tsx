import { Box, BoxProps } from '@mui/material';

export const BackgroundDiv = ({ children, ...props }: BoxProps) => (
  <Box sx={{ bgcolor: 'background.paper', padding: '1rem 3rem' }} {...props}>
    {children}
  </Box>
);
