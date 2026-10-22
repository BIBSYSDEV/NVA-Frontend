import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { PageWithRightSideMenu } from '../components/page-layouts/PageWithRightSideMenu';

interface KbsProjectLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
}

/* Same proportions as the registration page (PublicRegistration): an empty left column, then main and sidebar */
export const KbsProjectLayout = ({ main, sidebar }: KbsProjectLayoutProps) => (
  <Box
    sx={{
      p: { xs: '0.5rem', md: '1rem' },
      width: '100%',
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 5fr' },
      gap: '0.5rem',
    }}>
    <Box sx={{ gridColumn: { md: '2' }, minWidth: 0 }}>
      <PageWithRightSideMenu main={main} sidebar={sidebar} />
    </Box>
  </Box>
);
