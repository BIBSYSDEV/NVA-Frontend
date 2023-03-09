import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'formik';
import { Autocomplete, TextFieldProps } from '@mui/material';
import { CristinApiPath } from '../../../api/apiPaths';
import { Organization } from '../../../types/organization.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';
import { SearchResponse } from '../../../types/common.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';

interface OrganizationSearchFieldProps extends Pick<TextFieldProps, 'label'> {
  onChange?: (selectedInstitution: Organization | null) => void;
  disabled?: boolean;
  errorMessage?: string;
  fieldInputProps?: FieldInputProps<any>;
  isLoadingDefaultOptions?: boolean;
  defaultOptions?: Organization[];
  selectedValue?: Organization;
  customDataTestId?: string;
}

export const OrganizationSearchField = ({
  onChange,
  disabled = false,
  errorMessage,
  fieldInputProps,
  label,
  isLoadingDefaultOptions = false,
  defaultOptions = [],
  selectedValue,
  customDataTestId,
}: OrganizationSearchFieldProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const [institutionOptions, isLoadingInstitutionOptions] = useFetch<SearchResponse<Organization>>({
    url: debouncedQuery ? `${CristinApiPath.Organization}?query=${debouncedQuery}&results=20` : '',
    errorMessage: t('feedback.error.get_institutions'),
  });
  const isLoading = isLoadingDefaultOptions || isLoadingInstitutionOptions;
  const options = isLoadingInstitutionOptions || !institutionOptions ? defaultOptions : institutionOptions.hits;

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
      value={selectedValue}
      loading={isLoading}
      renderInput={(params) => (
        <AutocompleteTextField
          onBlur={fieldInputProps?.onBlur}
          value={fieldInputProps?.value}
          name={fieldInputProps?.name}
          {...params}
          data-testid={customDataTestId ?? dataTestId.organization.searchField}
          label={label ?? t('common.institution')}
          required
          placeholder={t('project.search_for_institution')}
          errorMessage={errorMessage}
          isLoading={isLoading}
          showSearchIcon={!selectedValue?.id}
        />
      )}
    />
  );
};
