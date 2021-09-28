import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';
import styled from 'styled-components';

const StyledProgressContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
`;

interface ButtonWithProgressProps extends ButtonProps {
  isLoading: boolean;
}

export const ButtonWithProgress = ({ disabled, isLoading, ...props }: ButtonWithProgressProps) => (
  <Button color="primary" disabled={disabled || isLoading} variant="contained" {...props}>
    {props.children}
    {isLoading && (
      <StyledProgressContainer>
        <CircularProgress size={15} thickness={5} />
      </StyledProgressContainer>
    )}
  </Button>
);
