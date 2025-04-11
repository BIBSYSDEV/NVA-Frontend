import ReplyIcon from '@mui/icons-material/Reply';
import { Box, IconButton, IconButtonProps } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router';
import { sideNavHeaderId } from './PageWithSideMenu';

interface SideMenuProps {
  children: ReactNode;
  expanded?: boolean;
  minimizedMenu?: ReactElement;
}

interface CustomIconButtonProps extends IconButtonProps {
  to?: LinkProps['to'];
}

export const MinimizedMenuIconButton = ({ children, to, ...props }: CustomIconButtonProps) => {
  return (
    <IconButton
      component={to ? Link : IconButton}
      to={to}
      {...props}
      sx={(theme) => ({
        background: theme.palette.primary.main,
        ':hover': {
          background: theme.palette.primary.dark,
        },
        color: theme.palette.common.white,
        borderRadius: '0',
      })}>
      <ReplyIcon />
      {children}
    </IconButton>
  );
};

export const SideMenu = ({ children, expanded, minimizedMenu }: SideMenuProps) => (
  <Box component="nav" aria-labelledby={sideNavHeaderId}>
    {expanded || !minimizedMenu ? (
      <Box sx={{ bgcolor: 'secondary.main', width: { xs: '100%', md: '20rem' }, height: '100%' }}>{children}</Box>
    ) : (
      minimizedMenu
    )}
  </Box>
);
