import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { AutoSearch } from '../../../../components/AutoSearch';
import { searchFailure } from '../../../../redux/actions/searchActions';
import useDebounce from '../../../../utils/hooks/useDebounce';
import { Institution } from '../../../../types/institution.types';
import { queryInstitution } from '../../../../api/InstitutionApi';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

  const search = useCallback(
    async (searchTerm: string) => {
      setSearching(true);
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
      clearSearchField={clearSearchField}
      dataTestId={dataTestId}
      onInputChange={value => setSearchTerm(value)}
      searchResults={searchResults}
      setValueFunction={setValueFunction}
      label={label}
      placeholder={placeholder}
    />
  );
};

export default InstitutionSearch;
