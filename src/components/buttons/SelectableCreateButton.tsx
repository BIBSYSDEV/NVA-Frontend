import { SelectableButton, SelectableButtonProps } from './SelectableButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Typography } from '@mui/material';

interface CreateButtonProps extends SelectableButtonProps {
  selectedColor?: string;
}

export const SelectableCreateButton = ({ sx, title, isSelected, selectedColor, ...rest }: CreateButtonProps) => {
  return (
    <SelectableButton
      sx={{
        bgcolor: isSelected ? selectedColor : 'tertiary.main',
        borderColor: isSelected ? selectedColor : 'tertiary.main',
        borderWidth: '1px',
        borderRadius: 0,
        width: '100%',
        justifyContent: 'center',
        ...sx,
      }}
      {...rest}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <AddCircleOutlineIcon />
        <Typography>{title}</Typography>
      </Box>
    </SelectableButton>
  );
};
