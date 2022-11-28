import { ButtonProps, Button } from '@mui/material';

interface TabButtonProps extends ButtonProps {
  isSelected: boolean;
}

export const TabButton = ({ isSelected, children, ...props }: TabButtonProps) => (
  <Button
    sx={{
      cursor: 'pointer',
      width: '40%',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      color: isSelected ? 'primary' : 'text.primary',
      borderBottom: isSelected ? '0.2rem solid' : null,
      textTransform: 'none',
    }}
    {...props}>
    {children}
  </Button>
);
