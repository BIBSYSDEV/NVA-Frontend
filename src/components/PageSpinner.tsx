import React from 'react';
import { CircularProgress, CircularProgressProps } from '@material-ui/core';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  margin: 5rem 0;
  display: flex;
  justify-content: center;
`;

export const PageSpinner = (props: CircularProgressProps) => (
  <ProgressContainer>
    <CircularProgress size={50} {...props} />
  </ProgressContainer>
);
