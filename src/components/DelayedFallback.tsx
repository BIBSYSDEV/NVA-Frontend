import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { ProgressWrapper } from './styled/Wrappers1';

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
        <ProgressWrapper>
          <CircularProgress size={50} />
        </ProgressWrapper>
      )}
    </>
  );
};
export default DelayedFallback;
