import { Button, ButtonProps, Checkbox } from '@mui/material';

interface SelectableButtonProps extends ButtonProps {
  isSelected: boolean;
  showCheckbox?: boolean;
}

export const SelectableButton = ({ isSelected, showCheckbox = false, children, ...rest }: SelectableButtonProps) => (
  <Button
    {...rest}
    startIcon={showCheckbox ? <Checkbox disableRipple sx={{ p: 0 }} checked={isSelected} /> : rest.startIcon}
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
