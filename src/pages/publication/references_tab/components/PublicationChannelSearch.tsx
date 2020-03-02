import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { getPublishers } from '../../../../api/publicationChannelApi';
import { AutoSearch } from '../../../../components/AutoSearch';
import { Publisher } from '../../../../types/references.types';
import { PublicationTableNumber } from '../../../../utils/constants';
import { debounce } from '../../../../utils/debounce';
import { NotificationVariant } from '../../../../types/notification.types';
import { addNotification } from '../../../../redux/actions/notificationActions';

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
        setSearchResults(response.filter((publisher: Publisher) => publisher.title));
      } else {
        dispatch(addNotification(t('error.search', NotificationVariant.Error)));
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
