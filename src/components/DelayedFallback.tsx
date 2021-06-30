import React, { useState, useEffect } from 'react';
import { PageSpinner } from './PageSpinner';

const DelayedFallback = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 300);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return show ? <PageSpinner /> : null;
};
export default DelayedFallback;
