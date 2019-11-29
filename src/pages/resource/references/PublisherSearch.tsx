import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { getPublicationChannels } from '../../../api/external/publicationChannelApi';
import { AutoSearch } from '../../../components/AutoSearch';
import { searchFailure } from '../../../redux/actions/searchActions';
import { PublicationChannel } from '../../../types/references.types';
import useDebounce from '../../../utils/hooks/useDebounce';

interface PublisherSearchProps {
  setFieldValue: (name: string, value: any) => void;
}

const PublisherSearch: React.FC<PublisherSearchProps> = ({ setFieldValue }) => {
  const [searchResults, setSearchResults] = useState<PublicationChannel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

  const search = useCallback(
    async (searchTerm: string) => {
      setSearching(true);
      const response = await getPublicationChannels(searchTerm);
      if (response) {
        setSearchResults(response);
      } else {
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

  return (
    <AutoSearch
      onInputChange={(_, value) => setSearchTerm(value)}
      searchResults={searchResults}
      setFieldValue={value => setFieldValue('publisher', value)}
      label={t('Publisher')}
    />
  );
};

export default PublisherSearch;
