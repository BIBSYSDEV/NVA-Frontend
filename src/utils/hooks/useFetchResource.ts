import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from './useFetch';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ResourceType, setResource } from '../../redux/resourcesSlice';
import { API_URL } from '../constants';

// This hook is used to fetch all top-level institutions and put them in Redux, to avoid fetching same data many times
export const useFetchResource = <T extends ResourceType>(
  id: string,
  errorMessage?: string
): [T | undefined, boolean] => {
  const dispatch = useDispatch();
  const resourcesState = useSelector((store: RootStore) => store.resources);
  const resource = resourcesState[id] as T | undefined;

  const [fetchedResource, isLoading] = useFetch<T>({
    url: !resource ? id : '',
    errorMessage,
  });

  useEffect(() => {
    if (fetchedResource) {
      const reduxKey = getResourceUri(id);
      dispatch(setResource({ reduxKey, ...fetchedResource }));
    }
  }, [dispatch, id, fetchedResource]);

  return [resource, isLoading];
};

const getResourceUri = (id: string) => (isValidUrl(id) ? id : `${API_URL.slice(0, -1)}${id}`);

const isValidUrl = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
