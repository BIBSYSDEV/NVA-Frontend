import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { Autocomplete, TextField } from '@mui/material';
import { CustomerInstitution } from '../../../types/customerInstitution.types';
import { InstitutionApiPath } from '../../../api/apiPaths';
import { Organization, OrganizationsResponse } from '../../../types/institution.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';
import { dataTestId } from '../../../utils/dataTestIds';

interface SelectInstitutionFieldProps {
  fieldName: string;
  onChange?: (selectedInstitution: Organization | null) => void;
  disabled?: boolean;
}

export const SelectInstitutionField = ({ fieldName, onChange, disabled = false }: SelectInstitutionFieldProps) => {
  const { t } = useTranslation('feedback');
  const { values } = useFormikContext<CustomerInstitution>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const [institutions, isLoadingInstitutions] = useFetch<OrganizationsResponse>({
    url: debouncedQuery ? `${InstitutionApiPath.Organization}?query=${debouncedQuery}&results=20` : '',
    errorMessage: t('error.get_institutions'),
  });

  const options = isLoadingInstitutions || !institutions ? [] : institutions.hits;

  return (
    <Field name={fieldName}>
      {({ field, meta: { touched, error } }: FieldProps<string>) => (
        <Autocomplete
          options={options}
          disabled={disabled}
          inputValue={values.name ? values.name : searchTerm}
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
          loading={isLoadingInstitutions}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              data-testid={dataTestId.organization.searchField}
              label={t('common:institution')}
              required
              variant="filled"
              fullWidth
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        />
      )}
    </Field>
  );
};

interface OrganizationSearchFieldProps {
  onChange?: (selectedInstitution: Organization | null) => void;
  disabled?: boolean;
  selectedOrganizationId?: string;
}

export const OrganizationSearchField = ({
  onChange,
  disabled = false,
  selectedOrganizationId,
}: OrganizationSearchFieldProps) => {
  const { t } = useTranslation('feedback');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const [institutionOptions, isLoadingInstitutionOptions] = useFetch<OrganizationsResponse>({
    url: debouncedQuery ? `${InstitutionApiPath.Organization}?query=${debouncedQuery}&results=20` : '',
    errorMessage: t('error.get_institutions'),
  });
  // const [selectedInstitution, isLoadingSelectedInstitution] = useFetchResource<Organization>(
  //   selectedOrganizationId ?? '',
  //   t('error.get_institution')
  // );

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
          {...params}
          data-testid={dataTestId.organization.searchField}
          label={t('common:institution')}
          required
          placeholder="Søk etter institusjon"
          variant="filled"
          fullWidth
          // error={touched && !!error}
          // helperText={<ErrorMessage name={field.name} />}
        />
      )}
    />
  );
};
