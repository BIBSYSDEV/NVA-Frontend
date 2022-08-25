import { ReactNode } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import { Box, Button, ButtonProps, styled, Typography } from '@mui/material';
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

const StyledSideMenuHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: '#e3e0dd',
  padding: '0.5rem 1rem 0.5rem 1rem',
});

export const SideNav = ({ children, ...props }: PropsWithChildren<Record<never, never>>) => (
  <Box component="nav" sx={{ bgcolor: 'background.paper' }} {...props}>
    {children}
  </Box>
);

interface SideNavHeaderProps {
  icon?: SvgIconComponent;
  text?: string;
  id?: string;
}

export const SideNavHeader = ({ icon, text, id }: SideNavHeaderProps) => {
  const IconComponent = icon;
  return (
    <StyledSideMenuHeader>
      {IconComponent && <IconComponent fontSize="large" />}
      <Typography component="h1" variant="h2" id={id}>
        {text}
      </Typography>
    </StyledSideMenuHeader>
  );
};

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
  isSelected?: boolean;
}

export const LinkButton = ({ isSelected, ...rest }: LinkButtonProps) => (
  <li>
    <Button variant={isSelected ? 'contained' : 'outlined'} size="large" LinkComponent={Link} {...rest} />
  </li>
);

interface LinkIconButtonProps extends LinkButtonProps {
  icon: ReactNode;
}

export const LinkIconButton = ({ sx = {}, icon, ...rest }: LinkIconButtonProps) => (
  <LinkButton sx={{ minWidth: 0, width: 0, ...sx }} {...rest}>
    &nbsp;{icon}&nbsp; {/* Add spaces to ensure same button height as buttons with text */}
  </LinkButton>
);

export const LinkButtonRow = ({ children }: PropsWithChildren<Record<never, never>>) => (
  <li>
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        p: 0,
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
      }}>
      {children}
    </Box>
  </li>
);
