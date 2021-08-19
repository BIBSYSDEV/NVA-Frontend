import { useEffect, useRef } from 'react';
import Axios, { CancelToken } from 'axios';

export const useCancelToken = (): CancelToken => {
  const cancelTokenSourceRef = useRef(Axios.CancelToken.source());

  // Cancel request on unmount
  useEffect(() => () => cancelTokenSourceRef.current.cancel(), []);

  return cancelTokenSourceRef.current.token;
};
