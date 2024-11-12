import { Autocomplete, TextFieldProps } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FieldInputProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrganizationSearchParams, searchForOrganizations } from '../../../api/cristinApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../utils/translation-helpers';

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

  const organizationQueryParams: OrganizationSearchParams = {
    query: debouncedQuery,
  };
  const organizationSearchQuery = useQuery({
    enabled: !!debouncedQuery,
    queryKey: ['organization', organizationQueryParams],
    queryFn: () => searchForOrganizations(organizationQueryParams),
    meta: { errorMessage: t('feedback.error.get_institutions') },
  });

  const isLoading = isLoadingDefaultOptions || organizationSearchQuery.isFetching;

  return (
    <Autocomplete
      options={organizationSearchQuery.data?.hits ?? defaultOptions}
      inputMode="search"
      disabled={disabled}
      getOptionLabel={(option) => getLanguageString(option.labels)}
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
