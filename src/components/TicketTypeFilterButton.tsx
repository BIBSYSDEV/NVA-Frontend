import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Box, Button, ButtonProps } from '@mui/material';

interface TicketTypeFilterButtonProps extends ButtonProps {
  isSelected: boolean;
}

export const TicketTypeFilterButton = ({ isSelected, children, ...rest }: TicketTypeFilterButtonProps) => (
  <Button
    {...rest}
    startIcon={isSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
    variant={isSelected ? 'contained' : 'outlined'}
    sx={{
      justifyContent: 'start',
      color: 'common.black',
      bgcolor: isSelected ? undefined : 'background.default',
      borderColor: `${rest.color}.main`,

      '.MuiButton-endIcon': {
        ml: 'auto',
        mr: '0.5rem',
      },
    }}>
    <Box sx={{ display: 'flex', gap: '0.1rem', alignItems: 'center' }}>{children}</Box>
  </Button>
);
