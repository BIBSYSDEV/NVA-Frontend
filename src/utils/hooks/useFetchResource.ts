import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from './useFetch';
import { RootState } from '../../redux/store';
import { setResource } from '../../redux/resourcesSlice';
import { API_URL } from '../constants';
import { isValidUrl } from '../general-helpers';

// This hook is used to fetch all top-level institutions and put them in Redux, to avoid fetching same data many times
/**
 * @deprecated Use react-query instead
 */
export const useFetchResource = <T>(id: string, errorMessage?: string): [T | undefined, boolean] => {
  const dispatch = useDispatch();
  const key = getKeyValue(id);
  const resourcesState = useSelector((store: RootState) => store.resources);
  const resource = resourcesState[key] as T | undefined;

  const [fetchedResource, isLoading] = useFetch<T>({
    url: !resource ? id : '',
    errorMessage,
  });

  useEffect(() => {
    if (fetchedResource) {
      dispatch(setResource({ key, data: fetchedResource }));
    }
  }, [dispatch, key, fetchedResource]);

  return [resource, isLoading];
};

const getKeyValue = (id: string) => (isValidUrl(id) ? id : `${API_URL.slice(0, -1)}${id}`);
