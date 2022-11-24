import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Button,
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Paper,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { useFetch } from '../../utils/hooks/useFetch';
import { getLanguageString } from '../../utils/translation-helpers';
import { getSortedSubUnits } from '../../utils/institutions-helpers';
import { CristinApiPath } from '../../api/apiPaths';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchResponse } from '../../types/common.types';
import { Organization } from '../../types/organization.types';
import { AffiliationHierarchy } from './AffiliationHierarchy';

interface OrganizationForm {
  unit: Organization | null;
  subunit: Organization | null;
  sselectedSuggestedAffiliationId: string;
}

const initialValuesOrganizationForm: OrganizationForm = {
  unit: null,
  subunit: null,
  sselectedSuggestedAffiliationId: '',
};

interface SelectInstitutionFormProps {
  onSubmit: (id: string) => void;
  onClose?: () => void;
  suggestedInstitutions: string[];
}

export const SelectInstitutionForm = ({ onSubmit, onClose, suggestedInstitutions }: SelectInstitutionFormProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const [institutions, isLoadingInstitutions] = useFetch<SearchResponse<Organization>>({
    url: debouncedQuery ? `${CristinApiPath.Organization}?query=${debouncedQuery}&results=20` : '',
    errorMessage: t('feedback.error.get_institutions'),
  });

  const options = isLoadingInstitutions || !institutions ? [] : institutions.hits;

  return (
    <Formik
      initialValues={initialValuesOrganizationForm}
      onSubmit={(values) => {
        if (values.sselectedSuggestedAffiliationId) {
          onSubmit(values.sselectedSuggestedAffiliationId);
        } else if (values.subunit?.id) {
          onSubmit(values.subunit.id);
        } else if (values.unit?.id) {
          onSubmit(values.unit?.id);
        }
      }}>
      {({ isSubmitting, values, setFieldValue, resetForm }: FormikProps<OrganizationForm>) => (
        <Form noValidate>
          {suggestedInstitutions.length > 0 && (
            <Paper elevation={4} sx={{ p: '1rem', maxHeight: '35vh', overflow: 'auto', mb: '1.5rem' }}>
              <FormControl>
                <FormLabel>{t('registration.contributors.suggested_affiliations')}</FormLabel>
                <Field name="suggestedAffiliationId">
                  {({ field }: FieldProps<Organization>) => (
                    <RadioGroup
                      sx={{ gap: '0.25rem' }}
                      {...field}
                      onChange={(event) => {
                        setSearchTerm('');
                        resetForm();
                        field.onChange(event);
                      }}>
                      {suggestedInstitutions.map((suggestedInstitution) => (
                        <FormControlLabel
                          key={suggestedInstitution}
                          value={suggestedInstitution}
                          control={<Radio size="small" />}
                          label={<AffiliationHierarchy unitUri={suggestedInstitution} />}
                        />
                      ))}
                    </RadioGroup>
                  )}
                </Field>
              </FormControl>
            </Paper>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name="unit">
              {({ field }: FieldProps<Organization>) => (
                <Autocomplete
                  {...field}
                  options={options}
                  inputValue={field.value ? getLanguageString(field.value.name) : searchTerm}
                  getOptionLabel={(option) => getLanguageString(option.name)}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {getLanguageString(option.name)}
                    </li>
                  )}
                  filterOptions={(options) => options}
                  onInputChange={(_, value, reason) => {
                    if (field.value) {
                      setFieldValue(field.name, null);
                    }
                    if (reason !== 'reset') {
                      setSearchTerm(value);
                    }
                  }}
                  onChange={(_, value) => {
                    resetForm();
                    setFieldValue(field.name, value);
                  }}
                  loading={isLoadingInstitutions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      data-testid={dataTestId.organization.searchField}
                      label={t('registration.contributors.search_for_institution')}
                      variant="filled"
                      fullWidth
                    />
                  )}
                />
              )}
            </Field>
            {values.unit?.hasPart && values.unit.hasPart.length > 0 && (
              <Field name="subunit">
                {({ field }: FieldProps<Organization>) => (
                  <Autocomplete
                    options={getSortedSubUnits(values.unit?.hasPart)}
                    getOptionLabel={(option) => getLanguageString(option.name)}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {getLanguageString(option.name)}
                      </li>
                    )}
                    onChange={(_, value) => setFieldValue(field.name, value)}
                    filterOptions={(options, state) =>
                      options.filter((option) =>
                        state.getOptionLabel(option).toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase())
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        data-testid={dataTestId.organization.subSearchField}
                        label={t('registration.contributors.department')}
                        variant="filled"
                        fullWidth
                      />
                    )}
                  />
                )}
              </Field>
            )}

            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
                disabled={!values.unit && !values.sselectedSuggestedAffiliationId}
                data-testid="institution-add-button">
                {t('common.add')}
              </LoadingButton>

              {onClose && (
                <Button onClick={onClose} data-testid="institution-cancel-button">
                  {t('common.cancel')}
                </Button>
              )}
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
