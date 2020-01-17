import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { getPublishers } from '../../../../api/publicationChannelApi';
import { AutoSearch } from '../../../../components/AutoSearch';
import { searchFailure } from '../../../../redux/actions/searchActions';
import { Publisher } from '../../../../types/references.types';
import { PublicationTableNumber } from '../../../../utils/constants';
import { debounce } from '../../../../utils/debounce';

interface PublicationChannelSearchProps {
  clearSearchField: boolean;
  dataTestId: string;
  label: string;
  publicationTable: PublicationTableNumber;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const PublicationChannelSearch: FC<PublicationChannelSearchProps> = ({
  clearSearchField,
  dataTestId,
  label,
  publicationTable,
  setValueFunction,
  placeholder,
}) => {
  const [searchResults, setSearchResults] = useState<Publisher[]>([]);
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await getPublishers(searchTerm, publicationTable);
      if (response) {
        setSearchResults(response.filter((element: Publisher) => element.title));
      } else {
        dispatch(searchFailure(t('error.search')));
      }
    }),
    [dispatch, t, publicationTable]
  );

  return (
    <AutoSearch
      clearSearchField={clearSearchField}
      dataTestId={dataTestId}
      onInputChange={value => search(value)}
      searchResults={searchResults}
      setValueFunction={setValueFunction}
      label={label}
      placeholder={placeholder}
    />
  );
};

export default PublicationChannelSearch;
