import { useState, useEffect } from 'react';
import { PageSpinner } from './PageSpinner';

export const DelayedFallback = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 300);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return show ? <PageSpinner /> : null;
};
