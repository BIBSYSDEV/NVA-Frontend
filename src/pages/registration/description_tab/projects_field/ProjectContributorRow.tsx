import { Box, Autocomplete, Typography, TextField, MenuItem } from '@mui/material';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../../api/apiPaths';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { SearchResponse } from '../../../../types/common.types';
import { CristinArrayValue, CristinUser } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { OrganizationSearchField } from '../../../admin/customerInstitutionFields/OrganizationSearchField';

const getValueByKey = (key: string, items?: CristinArrayValue[]) =>
  items?.find((item) => item.type === key)?.value ?? '';

const getFullName = (names: CristinArrayValue[]) =>
  `${getValueByKey('FirstName', names)} ${getValueByKey('LastName', names)}`;

export const ProjectContributorRow = () => {
  const { t } = useTranslation('project');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [personSearchResult, isLoadingPersonSearchResult] = useFetch<SearchResponse<CristinUser>>({
    url: debouncedSearchTerm ? `${CristinApiPath.Person}?results=20&query=${debouncedSearchTerm}` : '',
  });

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '1rem' }}>
        <Field name="contributors[0].type">
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              disabled
              select
              label={t('common:role')}
              variant="filled"
              helperText={<ErrorMessage name={field.name} />}>
              <MenuItem value="ProjectManager">{t('project_manager')}</MenuItem>
            </TextField>
          )}
        </Field>
        <Field name="contributors[0].identity.id">
          {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps<string>) => (
            <Autocomplete
              options={personSearchResult?.hits ?? []}
              inputMode="search"
              getOptionLabel={(option) => getFullName(option.names)}
              filterOptions={(options) => options}
              onInputChange={(_, value, reason) => {
                if (reason !== 'reset') {
                  setSearchTerm(value);
                }
              }}
              onChange={async (_, selectedUser) => {
                if (!selectedUser) {
                  setFieldValue(field.name, '');
                } else {
                  setFieldValue(field.name, selectedUser.id ?? '');
                }
                setSearchTerm('');
              }}
              loading={isLoadingPersonSearchResult}
              renderOption={(props, option) => {
                const orgId = option.affiliations.length > 0 ? option.affiliations[0].organization ?? '' : '';
                return (
                  <li {...props} key={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1">{getFullName(option.names)}</Typography>
                      {orgId && <AffiliationHierarchy unitUri={orgId} commaSeparated />}
                    </Box>
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  onBlur={field.onBlur}
                  value={field.value}
                  name={field.name}
                  data-testid={dataTestId.registrationWizard.description.projectForm.contributorsSearchField}
                  {...params}
                  required
                  label={t('person')}
                  placeholder={t('search_for_person')}
                  variant="filled"
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            />
          )}
        </Field>
        <Field name="contributors[0].affiliation.id">
          {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps<string>) => (
            <OrganizationSearchField
              onChange={(institution) => {
                setFieldValue(field.name, institution?.id ?? '');
              }}
              fieldInputProps={field}
              errorMessage={touched && !!error ? error : ''}
            />
          )}
        </Field>
      </Box>
    </>
  );
};
