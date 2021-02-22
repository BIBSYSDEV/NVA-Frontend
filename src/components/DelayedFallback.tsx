import React, { useState, useEffect, FC } from 'react';
import { PageSpinner } from './PageSpinner';

const DelayedFallback: FC = () => {
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
