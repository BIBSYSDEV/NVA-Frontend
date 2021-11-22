import { Box, BoxProps } from '@mui/material';

export const NewBackgroundDiv = ({ children, ...props }: BoxProps) => (
  <Box sx={{ background: '#faf7f4', padding: '1rem 3rem' }} {...props}>
    {children}
  </Box>
);
