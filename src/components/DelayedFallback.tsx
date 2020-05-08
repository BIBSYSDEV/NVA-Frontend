import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

const StyledProgressContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2rem;
`;

const DelayedFallback = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => setShow(true), 300);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {show && (
        <StyledProgressContainer>
          <CircularProgress size={50} />
        </StyledProgressContainer>
      )}
    </>
  );
};
export default DelayedFallback;
