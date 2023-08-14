import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Button, ButtonProps } from '@mui/material';

interface SelectableButtonProps extends ButtonProps {
  isSelected: boolean;
  showCheckbox?: boolean;
}

export const SelectableButton = ({
  isSelected,
  showCheckbox = false,
  children,
  startIcon,
  ...rest
}: SelectableButtonProps) => (
  <Button
    {...rest}
    startIcon={showCheckbox ? isSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon /> : startIcon}
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
