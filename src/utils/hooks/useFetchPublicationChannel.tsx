import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from './useFetch';
import { RootStore } from '../../redux/reducers/rootReducer';
import { Journal, Publisher } from '../../types/registration.types';
import { setPublicationChannel } from '../../redux/actions/publicationChannelActions';

// This hook is used to fetch all top-level institutions and put them in Redux, to avoid fetching same data many times
export const useFetchPublicationChannel = <T extends Journal | Publisher>(
  id: string,
  errorMessage: string
): [T, boolean] => {
  const dispatch = useDispatch();
  const publicationChannelState = useSelector((store: RootStore) => store.publicationChannel);
  const publicationChannel = publicationChannelState[id] as T;

  const [fetchedPublicationChannel, isLoading] = useFetch<T>({
    url: !publicationChannel ? id : '',
    errorMessage: errorMessage,
  });

  useEffect(() => {
    if (fetchedPublicationChannel) {
      dispatch(setPublicationChannel(fetchedPublicationChannel));
    }
  }, [dispatch, fetchedPublicationChannel]);

  return [publicationChannel, isLoading];
};
