import { useEffect, useState } from 'react';

import { DEBOUNCE_INTERVAL } from '../constants';

const useDebounce = (value: string, delay: number = DEBOUNCE_INTERVAL) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
