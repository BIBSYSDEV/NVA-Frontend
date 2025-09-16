import { Box, Button, ButtonProps, IconButton, IconButtonProps, styled } from '@mui/material';
import { Link, LinkProps } from 'react-router';

interface StyledMenuButtonContainerProps {
  isSelected: boolean;
}

const StyledMenuButtonContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<StyledMenuButtonContainerProps>(({ isSelected }) => ({
  display: 'flex',
  borderBottom: isSelected ? '0.375rem solid white' : 'none',
  boxShadow: isSelected ? '-1px 7px 4px -3px rgba(0,0,0,0.3)' : 'none',

  a: {
    marginBottom: isSelected ? '-0.375rem' : 0,
    whiteSpace: 'nowrap',
  },
}));

interface MenuButtonProps extends StyledMenuButtonContainerProps, ButtonProps, Pick<LinkProps, 'to'> {}

export const MenuButton = ({ isSelected, ...rest }: MenuButtonProps) => (
  <StyledMenuButtonContainer isSelected={isSelected}>
    <Button LinkComponent={Link} {...rest} />
  </StyledMenuButtonContainer>
);

interface MenuIconButtonProps extends StyledMenuButtonContainerProps, IconButtonProps, Pick<LinkProps, 'to'> {}

export const MenuIconButton = ({ isSelected, ...rest }: MenuIconButtonProps) => (
  <StyledMenuButtonContainer isSelected={isSelected}>
    <IconButton LinkComponent={Link} {...rest} />
  </StyledMenuButtonContainer>
);
