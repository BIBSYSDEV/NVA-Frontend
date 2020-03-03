import { useEffect, useState } from 'react';

import { DEBOUNCE_INTERVAL_INPUT } from '../constants';

const useDebounce = (value: string, delay: number = DEBOUNCE_INTERVAL_INPUT) => {
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
