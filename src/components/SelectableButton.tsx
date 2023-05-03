import { Button, ButtonProps } from '@mui/material';

interface SelectableButtonProps extends ButtonProps {
  isSelected: boolean;
}

export const SelectableButton = ({ isSelected, children, ...rest }: SelectableButtonProps) => (
  <Button
    {...rest}
    variant={isSelected ? 'contained' : 'outlined'}
    sx={{
      justifyContent: 'start',
      color: 'common.black',
      bgcolor: isSelected ? undefined : 'background.default',
      borderColor: `${rest.color}.main`,
      textTransform: 'none',
    }}>
    {children}
  </Button>
);
