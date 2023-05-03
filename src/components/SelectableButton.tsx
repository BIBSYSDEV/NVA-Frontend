import { Button, ButtonProps } from '@mui/material';

interface SelectableButtonProps extends ButtonProps {
  isSelected: boolean;
}

export const SelectableButton = ({ onClick, isSelected, children, ...rest }: SelectableButtonProps) => (
  <Button
    {...rest}
    variant={isSelected ? 'contained' : 'outlined'}
    onClick={onClick}
    sx={{
      // width: 'fit-content',
      justifyContent: 'start',
      color: 'common.black',
      bgcolor: isSelected ? undefined : 'background.default',
      borderColor: `${rest.color}.main`,
      textTransform: 'none',
    }}>
    {children}
  </Button>
);
