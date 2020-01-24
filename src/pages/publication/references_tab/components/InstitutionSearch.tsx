import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { AutoSearch } from '../../../../components/AutoSearch';
import { searchFailure } from '../../../../redux/actions/searchActions';
import { debounce } from '../../../../utils/debounce';
import { Institution } from '../../../../types/institution.types';
import { queryInstitution } from '../../../../api/institutionApi';
import i18n from './../../../../translations/i18n';

interface InstitutionSearchProps {
  clearSearchField: boolean;
  dataTestId: string;
  label: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const InstitutionSearch: FC<InstitutionSearchProps> = ({
  clearSearchField,
  dataTestId,
  label,
  setValueFunction,
  placeholder,
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
            title:
              institution.institutionNames.filter(unitName => unitName.language === i18n.language)[0]?.name ??
              institution.institutionNames[0].name,
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
    />
  );
};

export default InstitutionSearch;
