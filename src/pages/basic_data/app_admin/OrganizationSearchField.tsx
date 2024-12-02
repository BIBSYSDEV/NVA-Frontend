import { Autocomplete, TextFieldProps } from '@mui/material';
import { FieldInputProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultOrganizationSearchSize } from '../../../api/cristinApi';
import { useSearchForOrganizations } from '../../../api/hooks/useSearchForOrganizations';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { OrganizationRenderOption } from '../../../components/OrganizationRenderOption';
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

  const [searchSize, setSearchSize] = useState(defaultOrganizationSearchSize);
  const organizationSearchQuery = useSearchForOrganizations({ query: debouncedQuery, results: searchSize });

  const isLoading = isLoadingDefaultOptions || organizationSearchQuery.isFetching;
  const options = organizationSearchQuery.data?.hits ?? defaultOptions;

  return (
    <Autocomplete
      options={options}
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
      renderOption={({ key, ...props }, option) => (
        <OrganizationRenderOption key={option.id} props={props} option={option} />
      )}
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
      slotProps={{
        listbox: {
          component: AutocompleteListboxWithExpansion,
          ...({
            hasMoreHits: !!organizationSearchQuery.data?.size && organizationSearchQuery.data.size > searchSize,
            onShowMoreHits: () => setSearchSize(searchSize + defaultOrganizationSearchSize),
            isLoadingMoreHits: organizationSearchQuery.isFetching && searchSize > options.length,
          } satisfies AutocompleteListboxWithExpansionProps),
        },
      }}
    />
  );
};
