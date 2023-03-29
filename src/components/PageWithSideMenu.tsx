import { ReactNode } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import { Box, BoxProps, Button, ButtonProps, styled, Typography } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';

export const StyledPageWithSideMenu = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '40vh',
  display: 'grid',
  gap: '1rem',
  padding: '1rem',

  gridTemplateColumns: 'auto 1fr',
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

export const SidePanel = (props: BoxProps) => (
  <Box component="section" sx={{ bgcolor: 'secondary.main', width: { xs: '100%', md: '20rem' } }} {...props} />
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
      sx={{
        pt: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        a: { textTransform: 'none' },
        ...sx,
      }}
      {...props}
    />
  </nav>
);

interface LinkButtonProps extends ButtonProps, Partial<Pick<LinkProps, 'to'>> {
  isSelected?: boolean;
}

export const LinkButton = ({ isSelected, sx, ...rest }: LinkButtonProps) => (
  <Button
    sx={{ bgcolor: isSelected ? 'primary.main' : 'background.default', ml: '1rem', width: 'fit-content', ...sx }}
    variant={isSelected ? 'contained' : 'outlined'}
    LinkComponent={rest.to ? Link : undefined}
    {...rest}
  />
);

interface LinkIconButtonProps extends LinkButtonProps {
  icon: ReactNode;
}

export const LinkIconButton = ({ sx, icon, ...rest }: LinkIconButtonProps) => (
  <LinkButton sx={{ ml: '0rem', mr: '1rem', ...sx }} {...rest}>
    {icon}
  </LinkButton>
);

export const LinkButtonRow = ({ sx, ...props }: BoxProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '5rem',
      ...sx,
    }}
    {...props}
  />
);
