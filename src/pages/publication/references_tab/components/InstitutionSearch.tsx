import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { AutoSearch } from '../../../../components/AutoSearch';
import { searchFailure } from '../../../../redux/actions/searchActions';
import { debounce } from '../../../../utils/debounce';
import { Institution } from '../../../../types/institution.types';
import { queryInstitution } from '../../../../api/institutionApi';
import { selectInstitutionNameByLanguage } from '../../../../utils/helpers';

interface InstitutionSearchProps {
  clearSearchField: boolean;
  dataTestId: string;
  label: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
  selectedInstitution?: Institution;
  disabled?: boolean;
}

const InstitutionSearch: FC<InstitutionSearchProps> = ({
  clearSearchField,
  dataTestId,
  label,
  setValueFunction,
  placeholder,
  selectedInstitution,
  disabled,
}) => {
  const [searchResults, setSearchResults] = useState<Institution[]>([]);

  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await queryInstitution(searchTerm);
      if (response) {
        setSearchResults(
          response.map((institution: Institution) => ({
            ...institution,
            title: selectInstitutionNameByLanguage(institution.institutionNames),
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
