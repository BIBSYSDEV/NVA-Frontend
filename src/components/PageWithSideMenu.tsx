import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, BoxProps, Button, ButtonProps, styled, SvgIcon, Typography } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';

export const StyledPageWithSideMenu = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gap: '1rem',
  padding: '1rem',

  gridTemplateColumns: 'auto 1fr',
  [theme.breakpoints.down('md')]: {
    padding: 0,
    gridTemplateColumns: '1fr',
    marginTop: '1px',
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

interface SideNavHeaderProps {
  icon?: typeof SvgIcon;
  text?: string;
  id?: string;
}

export const SideNavHeader = ({ icon, text, id }: SideNavHeaderProps) => {
  const IconComponent = icon;
  return (
    <StyledSideMenuHeader>
      {IconComponent && <IconComponent sx={{ fontSize: '1.5rem' }} />}
      <Typography textTransform={'uppercase'} component="h1" variant="h3" id={id} sx={{ color: 'inherit' }}>
        {text}
      </Typography>
    </StyledSideMenuHeader>
  );
};

export const NavigationList = ({ sx, ...props }: BoxProps) => (
  <Box
    component="nav"
    sx={{
      mb: '0.5rem',
      mx: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      a: { textTransform: 'none' },
      ...sx,
    }}
    {...props}
  />
);

interface LinkButtonProps extends ButtonProps, Partial<Pick<LinkProps, 'to'>> {
  isSelected?: boolean;
}

export const LinkButton = ({ isSelected, sx, ...rest }: LinkButtonProps) => (
  <Button
    sx={{
      bgcolor: isSelected ? 'primary.main' : 'background.default',
      justifyContent: 'start',
      boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.20)',
      ...sx,
    }}
    variant={isSelected ? 'contained' : 'outlined'}
    LinkComponent={rest.to ? Link : undefined}
    {...rest}
  />
);

interface LinkCreateButtonProps extends LinkButtonProps {
  selectedColor?: string;
}

export const LinkCreateButton = ({ sx, title, isSelected, selectedColor, ...rest }: LinkCreateButtonProps) => {
  return (
    <LinkButton
      sx={{
        borderWidth: '1px',
        borderRadius: 0,
        borderColor: isSelected ? 'primary.main' : 'secondary.dark',
        bgcolor: isSelected ? selectedColor : 'none',
        width: '100%',
        justifyContent: 'center',
        ...sx,
      }}
      {...rest}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <AddCircleOutlineIcon />
        <Typography>{title}</Typography>
      </Box>
    </LinkButton>
  );
};
