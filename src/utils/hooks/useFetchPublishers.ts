import { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import { PublicationTableNumber } from '../constants';
import { Publisher } from '../../types/registration.types';
import { getPublishers } from '../../api/publicationChannelApi';
import { debounce } from '../debounce';

const useFetchPublishers = (
  publicationTable: PublicationTableNumber,
  initialSearchTerm: string = ''
): [Publisher[], boolean, (searchTerm: string) => void] => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleNewSearchTerm = useCallback(
    debounce(async (searchTerm: string) => {
      setSearchTerm(searchTerm);
    }),
    []
  );

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();
    const fetchPublishers = async () => {
      setIsLoading(true);
      const fetchedPublishers = await getPublishers(searchTerm, publicationTable, cancelSource.token);
      if (fetchedPublishers?.data) {
        setPublishers(fetchedPublishers.data.results);
      }
      setIsLoading(false);
    };
    if (searchTerm) {
      fetchPublishers();
    } else {
      setPublishers([]);
    }

    return () => {
      if (searchTerm) {
        cancelSource.cancel();
      }
    };
  }, [publicationTable, searchTerm]);

  return [publishers, isLoading, handleNewSearchTerm];
};

export default useFetchPublishers;
