import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Button, ButtonProps } from '@mui/material';

interface SelectableButtonProps extends ButtonProps {
  isSelected: boolean;
  showCheckbox?: boolean;
}

export const TicketTypeFilterButton = ({
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

      '.MuiButton-endIcon': {
        ml: 'auto',
        mr: '0.5rem',
      },
    }}>
    {children}
  </Button>
);
