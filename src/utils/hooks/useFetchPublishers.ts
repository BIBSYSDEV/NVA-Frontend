import { useState, useEffect } from 'react';
import Axios from 'axios';
import { PublicationTableNumber } from '../constants';
import { Publisher } from '../../types/registration.types';
import { getPublishers } from '../../api/publicationChannelApi';
import useDebounce from './useDebounce';

const useFetchPublishers = (
  publicationTable: PublicationTableNumber,
  initialSearchTerm: string = ''
): [Publisher[], boolean, (searchTerm: string) => void] => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const handleNewSearchTerm = (searchTerm: string) => setSearchTerm(searchTerm);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();
    const fetchPublishers = async () => {
      setIsLoading(true);
      const fetchedPublishers = await getPublishers(debouncedSearchTerm, publicationTable, cancelSource.token);
      if (fetchedPublishers?.data) {
        setPublishers(fetchedPublishers.data.results);
      }
      setIsLoading(false);
    };
    if (debouncedSearchTerm) {
      fetchPublishers();
    } else {
      setPublishers([]);
    }

    return () => {
      if (debouncedSearchTerm) {
        cancelSource.cancel();
      }
    };
  }, [publicationTable, debouncedSearchTerm]);

  return [publishers, isLoading, handleNewSearchTerm];
};

export default useFetchPublishers;
