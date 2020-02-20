import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { AutoSearch } from '../../../../components/AutoSearch';
import { searchFailure } from '../../../../redux/actions/searchActions';
import { debounce } from '../../../../utils/debounce';
import { Unit } from '../../../../types/institution.types';
import { getInstitutionAndSubunits } from '../../../../api/institutionApi';

interface InstitutionSearchProps {
  clearSearchField: boolean;
  dataTestId: string;
  label: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
}

const InstitutionSearch: FC<InstitutionSearchProps> = ({
  clearSearchField,
  dataTestId,
  label,
  setValueFunction,
  placeholder,
  disabled,
}) => {
  const [searchResults, setSearchResults] = useState<Unit[]>([]);

  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await getInstitutionAndSubunits(searchTerm);
      if (response) {
        setSearchResults(
          response.map((unit: Unit) => ({
            ...unit,
            title: unit.name,
          }))
        );
      } else {
        dispatch(searchFailure(t('error.search')));
      }
    }),
    [dispatch, t]
  );

  return (
    <AutoSearch
      clearSearchField={clearSearchField}
      dataTestId={dataTestId}
      onInputChange={search}
      searchResults={searchResults}
      setValueFunction={setValueFunction}
      label={label}
      placeholder={placeholder}
      displaySelection
      disabled={!!disabled}
    />
  );
};

export default InstitutionSearch;
