import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrganizationSearchParams, searchForOrganizations } from '../../api/cristinApi';
import { Organization } from '../../types/organization.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { getSortedSubUnits } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';
import { OrganizationRenderOption } from '../OrganizationRenderOption';
import { OrganizationBox } from './OrganizationBox';

enum SelectOrganizationFormField {
  Unit = 'unit',
  Subunit = 'subunit',
  selectedSuggestedAffiliationId = 'selectedSuggestedAffiliationId',
}

interface OrganizationForm {
  [SelectOrganizationFormField.Unit]: Organization | null;
  [SelectOrganizationFormField.Subunit]: Organization | null;
  [SelectOrganizationFormField.selectedSuggestedAffiliationId]: string;
}

const initialValuesOrganizationForm: OrganizationForm = {
  unit: null,
  subunit: null,
  selectedSuggestedAffiliationId: '',
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

  const organizationQueryParams: OrganizationSearchParams = {
    query: debouncedQuery,
    includeSubunits: true,
  };
  const organizationSearchQuery = useQuery({
    enabled: !!debouncedQuery,
    queryKey: ['organization', organizationQueryParams],
    queryFn: () => searchForOrganizations(organizationQueryParams),
    meta: { errorMessage: t('feedback.error.get_institutions') },
  });

  return (
    <Formik
      initialValues={initialValuesOrganizationForm}
      onSubmit={(values, { setSubmitting }) => {
        if (values.selectedSuggestedAffiliationId) {
          onSubmit(values.selectedSuggestedAffiliationId);
        } else if (values.subunit?.id) {
          onSubmit(values.subunit.id);
        } else if (values.unit?.id) {
          onSubmit(values.unit?.id);
        }
        setSubmitting(false);
      }}>
      {({ isSubmitting, values, setFieldValue, resetForm }: FormikProps<OrganizationForm>) => (
        <Form noValidate>
          {suggestedInstitutions.length > 0 && (
            <Paper elevation={4} sx={{ p: '1rem', maxHeight: '35vh', overflow: 'auto', mb: '1.5rem' }}>
              <FormControl>
                <FormLabel>{t('registration.contributors.suggested_affiliations')}</FormLabel>
                <Field name={SelectOrganizationFormField.selectedSuggestedAffiliationId}>
                  {({ field }: FieldProps<string>) => (
                    <RadioGroup
                      sx={{ gap: '0.5rem' }}
                      {...field}
                      onChange={(event) => {
                        setSearchTerm('');
                        resetForm();
                        field.onChange(event);
                      }}>
                      {suggestedInstitutions.map((suggestedInstitution) => (
                        <FormControlLabel
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              width: '100%',
                            },
                          }}
                          key={suggestedInstitution}
                          value={suggestedInstitution}
                          control={<Radio size="small" />}
                          label={<OrganizationBox unitUri={suggestedInstitution} />}
                        />
                      ))}
                    </RadioGroup>
                  )}
                </Field>
              </FormControl>
            </Paper>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name={SelectOrganizationFormField.Unit}>
              {({ field }: FieldProps<Organization>) => (
                <Autocomplete
                  {...field}
                  options={organizationSearchQuery.data?.hits ?? []}
                  inputValue={field.value ? getLanguageString(field.value.labels) : searchTerm}
                  getOptionLabel={(option) => getLanguageString(option.labels)}
                  renderOption={(props, option) => (
                    <OrganizationRenderOption key={option.id} props={props} option={option} />
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
                  loading={organizationSearchQuery.isPending}
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
              <Field name={SelectOrganizationFormField.Subunit}>
                {({ field }: FieldProps<Organization>) => (
                  <Autocomplete
                    options={getSortedSubUnits(values.unit?.hasPart)}
                    getOptionLabel={(option) => getLanguageString(option.labels)}
                    renderOption={(props, option) => (
                      <OrganizationRenderOption key={option.id} props={props} option={option} />
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
                disabled={!values.unit && !values.selectedSuggestedAffiliationId}
                data-testid={dataTestId.registrationWizard.contributors.addSelectedAffiliationButton}>
                {t('common.add')}
              </LoadingButton>

              {onClose && (
                <Button onClick={onClose} data-testid={dataTestId.confirmDialog.cancelButton}>
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
