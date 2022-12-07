import { Button, ButtonProps } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';

interface MenuButtonProps extends ButtonProps, Pick<LinkProps, 'to'> {
  isSelected: boolean;
}

export const MenuButton = ({ isSelected, sx, ...rest }: MenuButtonProps) => (
  <Button
    sx={{
      whiteSpace: 'nowrap',
      borderBottom: isSelected ? '0.375rem solid white' : 'none',
      borderRadius: '0px',
      mb: isSelected ? '-0.375rem' : '0rem', // Negates element re-size when border appears
      boxShadow: isSelected ? '-1px 7px 4px -3px rgba(0,0,0,0.3)' : 'none',
      height: '91%',
      ...sx,
    }}
    LinkComponent={Link}
    {...rest}
  />
);
