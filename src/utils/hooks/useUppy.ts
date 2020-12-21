import { useState, useEffect } from 'react';
import { Uppy } from '../../types/file.types';
import { createUppy } from '../uppy/uppy-config';

const useUppy = (shouldAllowMultipleFiles = true): Uppy => {
  const [uppy] = useState(createUppy(shouldAllowMultipleFiles));

  useEffect(
    () => () => {
      uppy && uppy.close();
    },
    [uppy]
  );

  return uppy;
};

export default useUppy;
