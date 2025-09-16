import { useRef } from 'react';

/**
 * Automatically resize multiline TextField when a value is set programmatically
 */
export const useAutoResizeTextFieldMultiline = () => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  return [ref, resize] as const;
};
