import { DEBOUNCE_INTERVAL } from './constants';

// Use any function to be debounced as first argument
export const debounce = (func: (args: any) => void, delay: number = DEBOUNCE_INTERVAL) => {
  let timeoutId: number;
  return (...args: any) => {
    clearInterval(timeoutId);
    timeoutId = setTimeout(() => func.apply(undefined, args), delay);
  };
};
