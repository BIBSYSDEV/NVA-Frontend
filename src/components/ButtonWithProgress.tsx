import React, { FC } from 'react';
import { Button, CircularProgress, ButtonProps } from '@material-ui/core';
import styled from 'styled-components';

const StyledProgressContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
`;

interface ButtonWithProgressProps extends ButtonProps {
  isLoading: boolean;
}

const ButtonWithProgress: FC<ButtonWithProgressProps> = ({ isLoading, ...props }) => (
  <Button color="primary" disabled={isLoading} variant="contained" {...props}>
    {props.children}
    {isLoading && (
      <StyledProgressContainer>
        <CircularProgress size={15} thickness={5} />
      </StyledProgressContainer>
    )}
  </Button>
);

export default ButtonWithProgress;
