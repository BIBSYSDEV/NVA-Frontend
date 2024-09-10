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
import { defaultOrganizationSizeParam } from '../../api/cristinApi';
import { useSearchForOrganizations } from '../../api/hooks/useSearchForOrganizations';
import { LanguageString } from '../../types/common.types';
import { Organization } from '../../types/organization.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { getSortedSubUnits } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../AutocompleteListboxWithExpansion';
import { OrganizationAccordion } from '../OrganizationAccordion';
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
  saveAffiliation: (id: string, labels?: LanguageString) => void;
  onCancel?: () => void;
  suggestedInstitutions?: string[];
  initialValues?: OrganizationForm;
}

export const SelectInstitutionForm = ({
  saveAffiliation,
  onCancel,
  suggestedInstitutions = [],
  initialValues = initialValuesOrganizationForm,
}: SelectInstitutionFormProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubunitId, setSelectedSubunitId] = useState(initialValues?.subunit?.id || '');
  const [selectedSubunitLabels, setSelectedSubunitLabels] = useState(initialValues?.subunit?.labels || undefined);

  const [searchSize, setSearchSize] = useState(defaultOrganizationSizeParam);
  const debouncedQuery = useDebounce(searchTerm);
  const organizationSearchQuery = useSearchForOrganizations({ query: debouncedQuery, results: searchSize });

  const institutionOptions = organizationSearchQuery.data?.hits ?? [];

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        if (values.selectedSuggestedAffiliationId) {
          // When we select from a list of suggested affiliations
          saveAffiliation(values.selectedSuggestedAffiliationId);
        } else if (values.subunit?.id) {
          // When we select from the subunit search field
          saveAffiliation(values.subunit.id, values.subunit.labels);
        } else if (selectedSubunitId) {
          // When we select from the list below the subunit search field
          saveAffiliation(selectedSubunitId, selectedSubunitLabels);
        } else if (values.unit?.id) {
          // When we only select from the unit search field (no sub-organization)
          saveAffiliation(values.unit?.id, values.unit?.labels);
        }
        setSubmitting(false);
      }}>
      {({ isSubmitting, values, setFieldValue, resetForm }: FormikProps<OrganizationForm>) => (
        <Form noValidate>
          {suggestedInstitutions.length > 0 && (
            <Paper elevation={4} sx={{ p: '1rem', maxHeight: '35vh', overflow: 'auto', mb: '1.5rem' }}>
              <FormControl>
                <FormLabel sx={{ mb: '0.5rem' }}>{t('registration.contributors.suggested_affiliations')}</FormLabel>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Typography variant="h3" sx={{ fontWeight: 'normal' }}>
                {t('common.select_institution')}
              </Typography>
              <Field name={SelectOrganizationFormField.Unit}>
                {({ field }: FieldProps<Organization>) => (
                  <Autocomplete
                    {...field}
                    options={institutionOptions}
                    inputValue={field.value ? getLanguageString(field.value.labels) : searchTerm}
                    getOptionLabel={(option) => getLanguageString(option.labels)}
                    renderOption={({ key, ...props }, option) => (
                      <OrganizationRenderOption key={option.id} props={props} option={option} />
                    )}
                    ListboxComponent={AutocompleteListboxWithExpansion}
                    ListboxProps={
                      {
                        hasMoreHits:
                          !!organizationSearchQuery.data?.size && organizationSearchQuery.data.size > searchSize,
                        onShowMoreHits: () => setSearchSize(searchSize + defaultOrganizationSizeParam),
                        isLoadingMoreHits: organizationSearchQuery.isFetching && searchSize > institutionOptions.length,
                      } satisfies AutocompleteListboxWithExpansionProps as any
                    }
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
                      resetForm({
                        values: initialValuesOrganizationForm,
                      });

                      setFieldValue(field.name, value);
                      setSelectedSubunitId('');
                      setSelectedSubunitLabels(undefined);
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
            </Box>

            {values.unit?.hasPart && values.unit.hasPart.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Typography variant="h3" sx={{ fontWeight: 'normal' }}>
                  {t('common.select_unit')}
                </Typography>
                <Field name={SelectOrganizationFormField.Subunit}>
                  {({ field }: FieldProps<Organization>) => (
                    <>
                      <Autocomplete
                        value={field.value}
                        options={getSortedSubUnits(values.unit?.hasPart)}
                        getOptionLabel={(option) => getLanguageString(option.labels)}
                        renderOption={({ key, ...props }, option) => (
                          <OrganizationRenderOption key={option.id} props={props} option={option} />
                        )}
                        onChange={(_, value) => {
                          setFieldValue(field.name, value);
                          setSelectedSubunitId(value?.id ?? '');
                          setSelectedSubunitLabels(value?.labels ?? undefined);
                        }}
                        filterOptions={(options, state) =>
                          options.filter((option) =>
                            Object.values(option.labels).some((label) =>
                              label.toLowerCase().includes(state.inputValue.toLowerCase())
                            )
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
                      {values.unit?.hasPart?.map((organization) => (
                        <OrganizationAccordion
                          key={organization.id}
                          organization={organization}
                          searchId={values.subunit?.id ?? ''}
                          selectedId={selectedSubunitId}
                          setSelectedId={setSelectedSubunitId}
                          setSelectedLabels={setSelectedSubunitLabels}
                        />
                      ))}
                    </>
                  )}
                </Field>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {onCancel && (
                <Button onClick={onCancel} data-testid={dataTestId.confirmDialog.cancelButton}>
                  {t('common.cancel')}
                </Button>
              )}
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
                disabled={!values.unit && !values.selectedSuggestedAffiliationId}
                data-testid={dataTestId.registrationWizard.contributors.addSelectedAffiliationButton}>
                {t('registration.contributors.add_affiliation')}
              </LoadingButton>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
