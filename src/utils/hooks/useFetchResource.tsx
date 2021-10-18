import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from './useFetch';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ResourceType, setResource } from '../../redux/actions/resourcesActions';

// This hook is used to fetch all top-level institutions and put them in Redux, to avoid fetching same data many times
export const useFetchResource = <T extends ResourceType>(id: string, errorMessage: string): [T, boolean] => {
  const dispatch = useDispatch();
  const resourcesState = useSelector((store: RootStore) => store.resources);
  const resource = resourcesState[id] as T;

  const [fetchedResource, isLoading] = useFetch<T>({
    url: !resource ? id : '',
    errorMessage,
  });

  useEffect(() => {
    if (fetchedResource) {
      dispatch(setResource(fetchedResource));
    }
  }, [dispatch, fetchedResource]);

  return [resource, isLoading];
};
