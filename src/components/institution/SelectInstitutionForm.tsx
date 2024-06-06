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
  Typography,
} from '@mui/material';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchForOrganizations } from '../../api/hooks/useSearchForOrganizations';
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
  addAffiliation: (id: string) => void;
  onClose?: () => void;
  suggestedInstitutions: string[];
}

export const SelectInstitutionForm = ({
  addAffiliation,
  onClose,
  suggestedInstitutions,
}: SelectInstitutionFormProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const organizationSearchQuery = useSearchForOrganizations(debouncedQuery);

  return (
    <Formik
      initialValues={initialValuesOrganizationForm}
      onSubmit={(values, { setSubmitting }) => {
        if (values.selectedSuggestedAffiliationId) {
          addAffiliation(values.selectedSuggestedAffiliationId);
        } else if (values.subunit?.id) {
          addAffiliation(values.subunit.id);
        } else if (values.unit?.id) {
          addAffiliation(values.unit?.id);
        }
        setSubmitting(false);
      }}>
      {({ isSubmitting, values, setFieldValue, resetForm }: FormikProps<OrganizationForm>) => {
        console.log('values', values);
        return (
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
                <>
                  <Typography variant="h3" component="h2" sx={{ marginTop: '1rem', fontWeight: 'normal' }}>
                    {t('common.select_unit')}
                  </Typography>
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
                            state
                              .getOptionLabel(option)
                              .toLocaleLowerCase()
                              .includes(state.inputValue.toLocaleLowerCase())
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
                </>
              )}

              <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {onClose && (
                  <Button onClick={onClose} data-testid={dataTestId.confirmDialog.cancelButton}>
                    {t('common.cancel')}
                  </Button>
                )}
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                  disabled={!values.unit && !values.selectedSuggestedAffiliationId}
                  data-testid={dataTestId.registrationWizard.contributors.addSelectedAffiliationButton}>
                  {t('common.add')}
                </LoadingButton>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};
