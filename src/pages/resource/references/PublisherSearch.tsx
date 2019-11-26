import Axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import { AutoSearch } from '../../../components/AutoSearch';
import { PublicationChannel } from '../../../types/references.types';
import { DEBOUNCE_INTERVAL, MINIMUM_SEARCH_CHARACTERS, PUBLISHERS_URL } from '../../../utils/constants';
import useDebounce from '../../../utils/hooks/useDebounce';

interface PublisherSearchProps {
  setFieldValue: (name: string, value: any) => void;
}

export const PublisherSearch: React.FC<PublisherSearchProps> = ({ setFieldValue }) => {
  const [searchResults, setSearchResults] = useState<PublicationChannel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_INTERVAL);

  const getQueryWithSearchTerm = (searchTerm: string) => ({
    tabell_id: 851,
    api_versjon: 1,
    statuslinje: 'N',
    begrensning: '10',
    kodetekst: 'J',
    desimal_separator: '.',
    variabler: ['*'],
    sortBy: [],
    filter: [{ variabel: 'Original tittel', selection: { filter: 'like', values: [`%${searchTerm}%`] } }],
  });

  const search = useCallback(async (searchTerm: string) => {
    setSearching(true);
    try {
      const response = await Axios({
        method: 'POST',
        url: PUBLISHERS_URL,
        data: getQueryWithSearchTerm(searchTerm),
      });
      setSearchResults(
        response.data.map((item: any) => ({
          title: item['Original tittel'],
          issn: item['Online ISSN'],
          level: item['Nivå 2019'],
          publisher: item['Utgiver'],
        }))
      );
    } catch (e) {
      // dispatch errors here
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm && !searching) {
      search(debouncedSearchTerm);
      setSearching(false);
    }
  }, [debouncedSearchTerm, search, searching]);

  const handleInputChange = (event: object, value: string) => {
    if (event !== null && value.length >= MINIMUM_SEARCH_CHARACTERS) {
      setSearchTerm(value);
    }
  };

  return (
    <AutoSearch
      onInputChange={handleInputChange}
      searchResults={searchResults}
      setFieldValue={setFieldValue}
      formikFieldName="publisher"
      label="Publisher"
    />
  );
};

export default PublisherSearch;
