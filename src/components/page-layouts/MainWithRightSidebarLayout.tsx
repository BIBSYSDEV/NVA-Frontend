import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  main: ReactNode;
  sidebar: ReactNode;
}

// NOTE: On mobile (xs), sidebar appears above main
export const MainWithRightSidebarLayout = ({ main, sidebar }: Props) => (
  <Box
    component="section"
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '4fr 1fr' },
      gridTemplateAreas: { xs: '"sidebar" "main"', sm: '"main sidebar"' },
      gap: '1rem',
    }}>
    <Box sx={{ gridArea: 'main' }}>{main}</Box>
    <Box sx={{ gridArea: 'sidebar' }}>{sidebar}</Box>
  </Box>
);
