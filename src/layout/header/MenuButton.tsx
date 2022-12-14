import { Box, Button, ButtonProps } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';

interface MenuButtonProps extends ButtonProps, Pick<LinkProps, 'to'> {
  isSelected: boolean;
}

export const MenuButton = ({ isSelected, sx, ...rest }: MenuButtonProps) => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      borderBottom: isSelected ? '0.375rem solid white' : 'none',
      boxShadow: '-1px 7px 4px -3px rgba(0,0,0,0.3)',
    }}>
    <Button
      sx={{
        mb: isSelected ? '-0.375rem' : 'none',
        whiteSpace: 'nowrap',
        ...sx,
      }}
      LinkComponent={Link}
      {...rest}
    />
  </Box>
);
