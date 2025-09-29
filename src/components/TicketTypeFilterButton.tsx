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
    color={isSelected ? 'tertiary' : 'white'}
    sx={{
      justifyContent: 'start',
      '.MuiButton-endIcon': {
        ml: 'auto',
        mr: '0.5rem',
      },
      '.MuiButton-startIcon': {
        color: 'secondary.main',
      },
    }}>
    <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>{children}</Box>
  </Button>
);
