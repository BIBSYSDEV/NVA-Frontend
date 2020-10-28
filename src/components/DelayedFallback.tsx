import React, { useState, useEffect, FC } from 'react';
import { CircularProgress } from '@material-ui/core';
import { StyledProgressWrapper } from './styled/Wrappers';

const DelayedFallback: FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 300);
    return () => {
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
