import ReplyIcon from '@mui/icons-material/Reply';
import { Box, IconButton, IconButtonProps, styled } from '@mui/material';
import { ReactElement, ReactNode } from 'react';

interface SideMenuProps {
  children: ReactNode;
  expanded?: boolean;
  minimizedMenu?: ReactElement;
}

const StyledMinimizedMenuButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.primary.main,
  ':hover': { background: theme.palette.primary.dark },
  color: theme.palette.common.white,
  borderRadius: '0',
}));

export const MinimizedMenuIconButton = ({ children, ...props }: IconButtonProps) => {
  return (
    <StyledMinimizedMenuButton {...props}>
      <ReplyIcon />
      {children}
    </StyledMinimizedMenuButton>
  );
};

export const SideMenu = ({ children, expanded, minimizedMenu }: SideMenuProps) => (
  <Box component="section" sx={{ minWidth: '5rem' }}>
    {expanded || !minimizedMenu ? (
      <Box sx={{ bgcolor: 'secondary.main', width: { xs: '100%', md: '20rem' }, height: '100%' }}>{children}</Box>
    ) : (
      minimizedMenu
    )}
  </Box>
);
