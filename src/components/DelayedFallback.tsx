import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { StyledProgressWrapper } from './styled/Wrappers';

const DelayedFallback = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 300);
    return () => {
      console.log('test');
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {show && (
        <StyledProgressWrapper>
          <CircularProgress size={50} />
        </StyledProgressWrapper>
      )}
    </>
  );
};
export default DelayedFallback;
