import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, Button, Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormikInstitutionUnitFieldNames } from '../../types/institution.types';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { useFetch } from '../../utils/hooks/useFetch';
import { getLanguageString } from '../../utils/translation-helpers';
import { LanguageString } from '../../types/common.types';

interface Organization {
  id: string;
  name: LanguageString;
  partOf?: Organization[];
  hasPart?: Organization[];
}

interface OrganizationForm {
  unit: Organization | null;
  subunit: Organization | null;
}

const initialValuesOrganizationForm: OrganizationForm = {
  unit: null,
  subunit: null,
};

interface OrganizationsResponse {
  hits: Organization[];
}

interface AddInstitutionProps {
  onSubmit: (id: string) => void;
  onClose?: () => void;
}

export const AddInstitution = ({ onSubmit, onClose }: AddInstitutionProps) => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm);
  const [institutions, isLoadingInstitutions] = useFetch<OrganizationsResponse>({
    url: debouncedQuery ? `/cristin/organization?query=${debouncedQuery}&results=30` : '',
    errorMessage: t('feedback:error.get_institutions'),
  });

  const options = institutions?.hits ?? [];

  return (
    <Formik
      initialValues={initialValuesOrganizationForm}
      onSubmit={(values) => onSubmit(values.subunit?.id ?? values.unit?.id ?? '')}>
      {({ isSubmitting, values }: FormikProps<OrganizationForm>) => (
        <Form noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name={FormikInstitutionUnitFieldNames.Unit}>
              {({ field, form: { setFieldValue } }: FieldProps) => (
                <Autocomplete
                  {...field}
                  options={searchTerm && debouncedQuery === searchTerm ? options : []}
                  getOptionLabel={(option) => getLanguageString(option.name)}
                  filterOptions={(options) => options}
                  onInputChange={(_, value, reason) => {
                    if (reason !== 'reset') {
                      setSearchTerm(value);
                    }
                  }}
                  onChange={(_, value) => setFieldValue(field.name, value)}
                  loading={isLoadingInstitutions}
                  renderInput={(params) => (
                    <TextField {...params} label={t('common:institution')} variant="filled" fullWidth />
                  )}
                />
              )}
            </Field>
            {values.unit?.hasPart && (
              <Field name={FormikInstitutionUnitFieldNames.SubUnit}>
                {({ field, form: { setFieldValue } }: FieldProps) => (
                  <Autocomplete
                    options={values.unit?.hasPart ?? []}
                    getOptionLabel={(option) => getLanguageString(option.name)}
                    onChange={(_, value) => setFieldValue(field.name, value)}
                    renderInput={(params) => (
                      <TextField {...params} label={t('institution:department')} variant="filled" fullWidth />
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
                disabled={!values.unit || isLoadingInstitutions}
                data-testid="institution-add-button">
                {t('add')}
              </LoadingButton>

              {onClose && (
                <Button onClick={onClose} data-testid="institution-cancel-button">
                  {t('cancel')}
                </Button>
              )}
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
