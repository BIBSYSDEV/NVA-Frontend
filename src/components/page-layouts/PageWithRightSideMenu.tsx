import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface PageWithRightSideMenuProps {
  main: ReactNode;
  sidebar: ReactNode;
}

export const PageWithRightSideMenu = ({ main, sidebar }: PageWithRightSideMenuProps) => (
  <Box
    component="section"
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '4fr 1fr' },
      gridTemplateAreas: { xs: '"sidebar" "main"', sm: '"main sidebar"' }, // NOTE: On mobile (xs), sidebar appears above main
      gap: '1rem',
    }}>
    <Box sx={{ gridArea: 'main' }}>{main}</Box>
    <Box sx={{ gridArea: 'sidebar' }}>{sidebar}</Box>
  </Box>
);
