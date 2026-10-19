import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface KbsProjectLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
}

/* Keeps main where it would be inside StyledPageContent (centered, max width lg), and lets the sidebar fill all space to the right of it */
export const KbsProjectLayout = ({ main, sidebar }: KbsProjectLayoutProps) => (
  <Box
    sx={(theme) => {
      const pageWidth = `min(100%, ${theme.breakpoints.values.lg}px)`;
      return {
        width: '100%',
        display: 'grid',
        gap: '1rem',
        py: '1rem',
        px: { xs: '1rem', sm: 0 },
        gridTemplateColumns: {
          xs: '1fr',
          sm: `calc((100% - ${pageWidth}) / 2) calc((${pageWidth} - 3rem) * 0.8) 1fr`,
        },
        gridTemplateAreas: { xs: '"sidebar" "main"', sm: '". main sidebar"' },
      };
    }}>
    <Box sx={{ gridArea: 'main', minWidth: 0 }}>{main}</Box>
    <Box sx={{ gridArea: 'sidebar', mr: { sm: '1rem' } }}>{sidebar}</Box>
  </Box>
);
