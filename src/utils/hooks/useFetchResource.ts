import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from './useFetch';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ResourceType, setResource } from '../../redux/resourcesSlice';

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
      dispatch(setResource({ key: id, data: fetchedResource }));
    }
  }, [dispatch, id, fetchedResource]);

  return [resource, isLoading];
};
