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

enum FormikInstitutionUnitFieldNames {
  SubUnit = 'subunit',
  Unit = 'unit',
}

interface OrganizationForm {
  unit: Organization | null;
  subunit: Organization | null;
}

const initialValuesOrganizationForm: OrganizationForm = {
  unit: null,
  subunit: null,
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
  const [selectedSuggestedAffiliation, setSelectedSuggestedAffiliation] = useState('');

  const options = isLoadingInstitutions || !institutions ? [] : institutions.hits;

  return (
    <Formik
      initialValues={initialValuesOrganizationForm}
      onSubmit={(values) => onSubmit((selectedSuggestedAffiliation || values.subunit?.id || values.unit?.id) ?? '')}>
      {({ isSubmitting, values, setFieldValue, resetForm }: FormikProps<OrganizationForm>) => (
        <Form noValidate>
          {suggestedInstitutions.length > 0 && (
            <Paper sx={{ p: '1rem', maxHeight: '50vh', overflow: 'auto' }}>
              <FormControl>
                <FormLabel>{t('registration.contributors.suggested_affiliations')}</FormLabel>
                <RadioGroup
                  sx={{ gap: '0.25rem' }}
                  value={selectedSuggestedAffiliation}
                  onChange={(event) => {
                    setSelectedSuggestedAffiliation(event.target.value);
                    resetForm();
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
              </FormControl>
            </Paper>
          )}
          <Box sx={{ mt: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name={FormikInstitutionUnitFieldNames.Unit}>
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
                    setFieldValue(field.name, value);
                    setSelectedSuggestedAffiliation('');
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
              <Field name={FormikInstitutionUnitFieldNames.SubUnit}>
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
                disabled={!values.unit && !selectedSuggestedAffiliation}
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
