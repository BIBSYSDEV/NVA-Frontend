import { ReactNode } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import { Box, BoxProps, Button, ButtonProps, styled, Typography } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';

export const StyledPageWithSideMenu = styled(Box)(({ theme }) => ({
  width: '100vw',
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

export const StyledPaperHeader = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  padding: '1rem',
}));

const StyledSideMenuHeader = styled(StyledPaperHeader)({
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem',
});

export const SidePanel = (props: BoxProps) => <Box component="section" sx={{ bgcolor: 'secondary.main' }} {...props} />;

interface SideNavHeaderProps {
  icon?: SvgIconComponent;
  text?: string;
  id?: string;
}

export const SideNavHeader = ({ icon, text, id }: SideNavHeaderProps) => {
  const IconComponent = icon;
  return (
    <StyledSideMenuHeader>
      {IconComponent && <IconComponent sx={{ fontSize: '1.5rem' }} />}
      <Typography component="h1" variant="h3" id={id} sx={{ color: 'inherit' }}>
        {text}
      </Typography>
    </StyledSideMenuHeader>
  );
};

export const NavigationList = ({ sx, ...props }: BoxProps) => (
  <nav>
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        px: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        ...sx,
      }}
      {...props}
    />
  </nav>
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

export const LinkButtonRow = ({ sx, ...props }: BoxProps) => (
  <li>
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        p: 0,
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        ...sx,
      }}
      {...props}
    />
  </li>
);
