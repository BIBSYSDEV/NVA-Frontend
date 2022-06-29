import { Box, Button, ButtonProps, styled } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Link, LinkProps } from 'react-router-dom';

export const StyledPageWithSideMenu = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '40vh',
  display: 'grid',
  gap: '1rem',
  padding: '1rem',

  gridTemplateColumns: '1fr 4fr',
  [theme.breakpoints.down('md')]: {
    padding: 0,
    gridTemplateColumns: '1fr',
  },
}));

export const StyledSideMenuHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: '#e3e0dd',
  padding: '0.5rem 1rem 0.5rem 1rem',
});

export const SideMenu = ({ children }: PropsWithChildren<Record<never, never>>) => (
  <Box component="nav" sx={{ bgcolor: 'background.paper' }}>
    {children}
  </Box>
);

export const NavigationList = ({ children }: PropsWithChildren<Record<never, never>>) => (
  <Box
    component="ul"
    sx={{
      listStyle: 'none',
      px: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
    {children}
  </Box>
);

interface LinkButtonProps extends ButtonProps, Pick<LinkProps, 'to'> {
  isSelected: boolean;
}

export const LinkButton = ({ isSelected, ...rest }: LinkButtonProps) => (
  <Button variant={isSelected ? 'contained' : 'outlined'} size="large" LinkComponent={Link} {...rest} />
);

export const LinkButtonRow = ({ children }: PropsWithChildren<Record<never, never>>) => (
  <Box
    component="ul"
    sx={{
      listStyle: 'none',
      p: 0,
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
    }}>
    {children}
  </Box>
);
