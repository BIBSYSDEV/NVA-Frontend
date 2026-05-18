import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton, IconButtonProps } from '@mui/material';
import { Link, LinkProps } from 'react-router';

interface NavigationIconButtonProps extends IconButtonProps, Pick<LinkProps, 'to' | 'state'> {
  navigateTo: 'previous' | 'next';
}

export const NavigationIconButton = ({ navigateTo, sx, ...rest }: NavigationIconButtonProps) => (
  <IconButton
    component={Link}
    size="small"
    sx={{
      display: { xs: 'none', md: 'inherit' },
      mt: '20rem',
      height: 'fit-content',
      justifySelf: navigateTo === 'previous' ? 'start' : 'end',
      border: '1px solid',
      borderColor: 'primary.main',
      bgcolor: 'tertiary.main',
      '&:hover': {
        bgcolor: 'tertiary.dark',
      },
      ...sx,
    }}
    {...rest}>
    {navigateTo === 'previous' ? (
      <ArrowBackIosNewIcon fontSize="small" color="primary" />
    ) : (
      <ArrowForwardIosIcon fontSize="small" color="primary" />
    )}
  </IconButton>
);
