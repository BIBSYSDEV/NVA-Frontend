import { Box } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { sideNavHeaderId } from './_utils/side-menu-constants';

interface SideMenuProps {
  children: ReactNode;
  isVisible?: boolean;
  backToSideMenuButton?: ReactElement;
}

export const SideMenu = ({ children, isVisible, backToSideMenuButton }: SideMenuProps) => (
  <Box component="nav" aria-labelledby={sideNavHeaderId}>
    {isVisible || !backToSideMenuButton ? (
      <Box sx={{ bgcolor: 'background.default', width: { xs: '100%', md: '20rem' }, height: '100%' }}>{children}</Box>
    ) : (
      backToSideMenuButton
    )}
  </Box>
);
