export const useCancelToken = () => {
  // const cancelTokenSourceRef = useRef(Axios.CancelToken.source());

  // // Cancel request on unmount
  // useEffect(() => () => cancelTokenSourceRef.current.cancel(), []);

  // return cancelTokenSourceRef.current.token;

  // Remove cancellation for now, due to changes in React v18, and that it has always been a bit shaky
  // Probably better to just remove all this, and rather use react-query (or similar) for data fetching instead
  return undefined;
};
