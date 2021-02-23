import { useState, useEffect } from 'react';
import { PublicationTableNumber } from '../constants';
import { Publisher } from '../../types/registration.types';
import { getPublishers } from '../../api/publicationChannelApi';
import useDebounce from './useDebounce';
import useCancelToken from './useCancelToken';

const useFetchPublishers = (
  publicationTable: PublicationTableNumber,
  initialSearchTerm = ''
): [Publisher[], boolean, (searchTerm: string) => void] => {
  const cancelToken = useCancelToken();
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const handleNewSearchTerm = (searchTerm: string) => setSearchTerm(searchTerm);

  useEffect(() => {
    const fetchPublishers = async () => {
      setIsLoading(true);
      const fetchedPublishers = await getPublishers(debouncedSearchTerm, publicationTable, cancelToken);
      if (fetchedPublishers) {
        if (fetchedPublishers.data) {
          setPublishers(fetchedPublishers.data.results);
        }
        setIsLoading(false);
      }
    };
    if (debouncedSearchTerm) {
      fetchPublishers();
    } else {
      setPublishers([]);
    }
  }, [cancelToken, publicationTable, debouncedSearchTerm]);

  return [publishers, isLoading, handleNewSearchTerm];
};

export default useFetchPublishers;
