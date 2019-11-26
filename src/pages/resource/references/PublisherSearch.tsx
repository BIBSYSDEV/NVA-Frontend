import Axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { AutoSearch } from '../../../components/AutoSearch';
import { searchFailure } from '../../../redux/actions/searchActions';
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
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

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

  const search = useCallback(
    async (searchTerm: string) => {
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
        dispatch(searchFailure(t('error.search')));
      }
    },
    [dispatch, t]
  );

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
      label={t('Publisher')}
    />
  );
};

export default PublisherSearch;
