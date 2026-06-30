import { Box, BoxProps } from '@mui/material';
import { ElementType } from 'react';

interface NavigationListProps extends BoxProps {
  component?: ElementType;
}

export const NavigationList = ({ sx, ...props }: NavigationListProps) => (
  <Box
    component="nav"
    sx={[
      { mb: '0.5rem', mx: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...props}
  />
);
