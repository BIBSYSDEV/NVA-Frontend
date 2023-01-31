import { Autocomplete } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerifiedFundingApiPath } from '../../../api/apiPaths';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { SearchResponse } from '../../../types/common.types';
import { NfrProject } from '../../../types/project.types';
import { SpecificFundingFieldNames } from '../../../types/publicationFieldNames';
import { Funding } from '../../../types/registration.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NfrProjectSearchProps {
  baseFieldName: string;
}

export const NfrProjectSearch = ({ baseFieldName }: NfrProjectSearchProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [nfrProjectSearch, isLoadingNfrProjectSearch] = useFetch<SearchResponse<NfrProject>>({
    url: debouncedSearchTerm ? `${VerifiedFundingApiPath.Nfr}?term=${debouncedSearchTerm}&size=20` : '',
  });
  const projects = nfrProjectSearch?.hits ?? [];

  return (
    <Field name={`${baseFieldName}.${SpecificFundingFieldNames.Id}`}>
      {({ field: { name, onBlur }, form: { setFieldValue }, meta: { touched, error } }: FieldProps<string>) => (
        <Autocomplete
          options={projects}
          filterOptions={(options) => options}
          onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
          getOptionLabel={(option) => getLanguageString(option.labels)}
          onChange={(_, value) => {
            if (value) {
              const { lead, ...rest } = value;
              const nfrFunding: Funding = {
                type: 'ConfirmedFunding',
                ...rest,
              };
              setFieldValue(baseFieldName, nfrFunding);
            }
          }}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              name={name}
              onBlur={onBlur}
              label={t('registration.description.funding.nfr_project')}
              isLoading={isLoadingNfrProjectSearch}
              placeholder={t('registration.description.funding.nfr_project_search')}
              showSearchIcon
              required
              errorMessage={touched && !!error ? error : undefined}
            />
          )}
        />
      )}
    </Field>
  );
};
