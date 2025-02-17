import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, BoxProps, styled, SvgIcon, Typography } from '@mui/material';
import { ElementType } from 'react';
import { SelectableButton, SelectableButtonProps } from './SelectableButton';

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
}

export const sideNavHeaderId = 'left-side-menu-header';

export const SideNavHeader = ({ icon, text }: SideNavHeaderProps) => {
  const IconComponent = icon;
  return (
    <StyledSideMenuHeader>
      {IconComponent && <IconComponent sx={{ fontSize: '1.5rem' }} />}
      <Typography
        textTransform={'uppercase'}
        component="h2"
        fontWeight="bold"
        fontSize="1rem"
        id={sideNavHeaderId}
        sx={{ color: 'inherit' }}>
        {text}
      </Typography>
    </StyledSideMenuHeader>
  );
};

interface NavigationListProps extends BoxProps {
  component?: ElementType;
}

export const navigationListHeaderId = 'navigation-list-header';

export const NavigationList = ({ sx, ...props }: NavigationListProps) => (
  <Box
    component="nav"
    aria-labelledby={navigationListHeaderId}
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

interface LinkCreateButtonProps extends SelectableButtonProps {
  selectedColor?: string;
}

export const LinkCreateButton = ({ sx, title, isSelected, selectedColor, ...rest }: LinkCreateButtonProps) => {
  return (
    <SelectableButton
      sx={{
        textTransform: 'uppercase',
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
    </SelectableButton>
  );
};
