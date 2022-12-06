import { Button, ButtonProps } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';

interface MenuButtonProps extends ButtonProps, Pick<LinkProps, 'to'> {
  isSelected: boolean;
}

export const MenuButton = ({ isSelected, ...rest }: MenuButtonProps) => (
  <Button
    sx={{ whiteSpace: 'nowrap', borderBottom: isSelected ? '4px solid white' : 'none', borderRadius: '0px' }}
    LinkComponent={Link}
    {...rest}
  />
);
