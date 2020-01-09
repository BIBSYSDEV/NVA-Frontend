import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { getDataFromNsd } from '../../../../api/external/publicationChannelApi';
import { AutoSearch } from '../../../../components/AutoSearch';
import { searchFailure } from '../../../../redux/actions/searchActions';
import { PublicationChannel } from '../../../../types/references.types';
import { PublicationTableNumber } from '../../../../utils/constants';
import useDebounce from '../../../../utils/hooks/useDebounce';

interface PublicationChannelSearchProps {
  clearSearchField: boolean;
  label: string;
  publicationTable: PublicationTableNumber;
  setValueFunction: (value: any) => void;
  value: string;
}

const PublicationChannelSearch: React.FC<PublicationChannelSearchProps> = ({
  clearSearchField,
  label,
  publicationTable,
  setValueFunction,
  value,
}) => {
  const [searchResults, setSearchResults] = useState<PublicationChannel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

  const search = useCallback(
    async (searchTerm: string) => {
      setSearching(true);
      const response = await getDataFromNsd(searchTerm, publicationTable);
      if (response) {
        setSearchResults(response);
      } else {
        dispatch(searchFailure(t('error.search')));
      }
    },
    [dispatch, t, publicationTable]
  );

  useEffect(() => {
    if (debouncedSearchTerm && !searching) {
      search(debouncedSearchTerm);
      setSearching(false);
    }
  }, [debouncedSearchTerm, search, searching]);

  return (
    <AutoSearch
      clearSearchField={clearSearchField}
      onInputChange={(_, value) => setSearchTerm(value)}
      searchResults={searchResults}
      setValueFunction={setValueFunction}
      label={label}
      value={value}
    />
  );
};

export default PublicationChannelSearch;
