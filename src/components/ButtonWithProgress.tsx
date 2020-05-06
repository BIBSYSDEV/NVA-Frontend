import React, { FC, ReactNode } from 'react';
import { Button } from '@material-ui/core';
import Progress from './Progress';
import styled from 'styled-components';

const StyledProgressContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
`;

interface ButtonWithProgressProps {
  children: ReactNode;
  isLoading: boolean;
  onClick?: () => void;
  type?: 'submit' | 'reset' | 'button';
}

const ButtonWithProgress: FC<ButtonWithProgressProps> = ({ children, isLoading, onClick, type }) => {
  return (
    <Button color="primary" disabled={isLoading} onClick={onClick} type={type} variant="contained">
      {children}
      {isLoading && (
        <StyledProgressContainer>
          <Progress size={15} thickness={5} />
        </StyledProgressContainer>
      )}
    </Button>
  );
};

export default ButtonWithProgress;
