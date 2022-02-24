import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'formik';
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import { CristinApiPath } from '../../../api/apiPaths';
import { Organization } from '../../../types/organization.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';
import { SearchResponse } from '../../../types/common.types';

interface OrganizationSearchFieldProps extends Pick<TextFieldProps, 'label'> {
  onChange?: (selectedInstitution: Organization | null) => void;
  disabled?: boolean;
  errorMessage?: string;
  fieldInputProps?: FieldInputProps<string>;
  dataTestId?: string;
}

export const OrganizationSearchField = ({
  onChange,
  disabled = false,
  errorMessage,
  fieldInputProps,
  label,
  dataTestId,
}: OrganizationSearchFieldProps) => {
  const { t } = useTranslation('feedback');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const [institutionOptions, isLoadingInstitutionOptions] = useFetch<SearchResponse<Organization>>({
    url: debouncedQuery ? `${CristinApiPath.Organization}?query=${debouncedQuery}&results=20` : '',
    errorMessage: t('error.get_institutions'),
  });

  const options = isLoadingInstitutionOptions || !institutionOptions ? [] : institutionOptions.hits;

  return (
    <Autocomplete
      options={options}
      inputMode="search"
      disabled={disabled}
      getOptionLabel={(option) => getLanguageString(option.name)}
      filterOptions={(options) => options}
      onInputChange={(_, value, reason) => {
        if (reason !== 'reset') {
          setSearchTerm(value);
        }
      }}
      onChange={(_, selectedInstitution) => {
        if (!disabled) {
          onChange?.(selectedInstitution);
        }
        setSearchTerm('');
      }}
      loading={isLoadingInstitutionOptions}
      renderInput={(params) => (
        <TextField
          onBlur={fieldInputProps?.onBlur}
          value={fieldInputProps?.value}
          name={fieldInputProps?.name}
          {...params}
          data-testid={dataTestId}
          label={label ?? t('common:institution')}
          required
          placeholder={t('project:search_for_institution')}
          variant="filled"
          fullWidth
          error={!!errorMessage}
          helperText={errorMessage}
        />
      )}
    />
  );
};
