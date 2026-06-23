import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, BoxProps, Typography } from '@mui/material';
import { ElementType } from 'react';
import { SelectableButton, SelectableButtonProps } from './SelectableButton';

interface NavigationListProps extends BoxProps {
  component?: ElementType;
}

export const NavigationList = ({ sx, ...props }: NavigationListProps) => (
  <Box
    component="nav"
    sx={{
      mb: '0.5rem',
      mx: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      ...sx,
    }}
    {...props}
  />
);

interface LinkCreateButtonProps extends SelectableButtonProps {
  selectedColor?: string;
}

export const LinkCreateButton = ({ sx, title, isSelected, selectedColor, ...rest }: LinkCreateButtonProps) => {
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
