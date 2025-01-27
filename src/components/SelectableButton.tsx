import { Button, ButtonProps } from '@mui/material';
import { Link, LinkProps } from 'react-router';

export interface SelectableButtonProps extends ButtonProps, Partial<Pick<LinkProps, 'to' | 'state'>> {
  isSelected?: boolean;
}

export const SelectableButton = ({ isSelected, sx, ...rest }: SelectableButtonProps) => (
  <Button
    sx={{
      textTransform: 'none',
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
