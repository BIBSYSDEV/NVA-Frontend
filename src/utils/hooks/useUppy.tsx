import { useState, useEffect } from 'react';
import { Uppy } from '../../types/file.types';
import { createUppy } from '../uppy-config';

const useUppy = (shouldAllowMultipleFiles: boolean = true): Uppy => {
  const [uppy] = useState(createUppy(shouldAllowMultipleFiles));

  useEffect(() => {
    return () => uppy && uppy.close();
  }, [uppy]);

  return uppy;
};

export default useUppy;
