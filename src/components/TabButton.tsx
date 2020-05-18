import React, { FC } from 'react';
import styled from 'styled-components';
import { ButtonProps, Button } from '@material-ui/core';

const StyledTabButton = styled(({ isSelected, ...rest }) => <Button {...rest} />)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 50%;
  font-weight: bold;
  font-size: 1.2rem;
  padding-bottom: 0.6rem;

  ${({ isSelected, theme }) =>
    isSelected &&
    `
    color: ${theme.palette.primary.main};
    padding-bottom: 0.4rem;
    border-bottom: 0.2rem solid;
  `};
`;

interface TabButtonProps extends ButtonProps {
  isSelected: boolean;
}

const TabButton: FC<TabButtonProps> = ({ isSelected, ...props }) => {
  return (
    <StyledTabButton isSelected={isSelected} {...props}>
      {props.children}
    </StyledTabButton>
  );
};

export default TabButton;
