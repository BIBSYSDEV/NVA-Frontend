import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { AutoSearch } from '../../../../components/AutoSearch';
import { debounce } from '../../../../utils/debounce';
import { RecursiveInstitutionUnit } from '../../../../types/institution.types';
import { getInstitutionAndSubunits } from '../../../../api/institutionApi';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import { filterInstitutions } from '../../../../utils/institutions-helpers';

interface InstitutionSearchProps {
  clearSearchField: boolean;
  dataTestId: string;
  label: string;
  setValueFunction: (value: any) => void;
  disabled?: boolean;
  excludeInstitutionIds?: string[];
  initialValue?: string;
  placeholder?: string;
}

const InstitutionSearch: FC<InstitutionSearchProps> = ({
  clearSearchField,
  dataTestId,
  label,
  setValueFunction,
  disabled,
  excludeInstitutionIds,
  initialValue,
  placeholder,
}) => {
  const [searchResults, setSearchResults] = useState<RecursiveInstitutionUnit[]>([]);

  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await getInstitutionAndSubunits(searchTerm);
      if (response) {
        const relevantInstitutions = excludeInstitutionIds
          ? filterInstitutions(response, excludeInstitutionIds)
          : response;
        setSearchResults(relevantInstitutions);
      } else {
        dispatch(setNotification(t('error.search', NotificationVariant.Error)));
      }
    }),
    [dispatch, t]
  );

  return (
    <AutoSearch
      clearSearchField={clearSearchField}
      dataTestId={dataTestId}
      disabled={!!disabled}
      displaySelection
      initialValue={initialValue}
      label={label}
      onInputChange={search}
      placeholder={placeholder}
      searchResults={searchResults}
      setValueFunction={setValueFunction}
    />
  );
};

export default InstitutionSearch;
