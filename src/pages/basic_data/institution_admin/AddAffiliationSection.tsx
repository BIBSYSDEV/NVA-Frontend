import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { OrganizationRenderOption } from '../../../components/OrganizationRenderOption';
import { RootState } from '../../../redux/store';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useFetchResource } from '../../../utils/hooks/useFetchResource';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { PositionField } from '../fields/PositionField';
import { StartDateField } from '../fields/StartDateField';
import { AddEmployeeData } from './AddEmployeePage';

export const AddAffiliationSection = () => {
  const { t } = useTranslation();
  const { values, errors, setFieldValue, setFieldTouched, isSubmitting } = useFormikContext<AddEmployeeData>();
  const user = useSelector((store: RootState) => store.user);
  const [currentOrganization, isLoadingCurrentOrganization] = useFetchResource<Organization>(
    user?.topOrgCristinId ?? ''
  );
  const organizationOptions = currentOrganization ? getSortedSubUnits([currentOrganization]) : [];

  const isDisabled =
    !!errors.person?.firstName || !!errors.person?.lastName || !!errors.person?.nationalId || isSubmitting;

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('common.employment')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Field name="affiliation.organization">
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <Autocomplete
              disabled={isDisabled}
              value={organizationOptions.find((option) => option.id === field.value) ?? null}
              options={organizationOptions}
              getOptionLabel={(option) => getLanguageString(option.labels)}
              renderOption={({ key, ...props }, option) => (
                <OrganizationRenderOption key={option.id} props={props} option={option} />
              )}
              loading={isLoadingCurrentOrganization}
              onChange={(_, value) => setFieldValue(field.name, value?.id)}
              renderInput={(params) => (
                <TextField
                  type="search"
                  {...field}
                  {...params}
                  required
                  label={t('registration.contributors.department')}
                  variant="filled"
                  fullWidth
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  data-testid={dataTestId.basicData.personAdmin.institution}
                />
              )}
            />
          )}
        </Field>
        <Box display={{ display: 'flex', gap: '1rem' }}>
          <PositionField fieldName="affiliation.type" disabled={isDisabled} />

          <Field name="affiliation.fullTimeEquivalentPercentage">
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                {...field}
                disabled={isDisabled}
                fullWidth
                type="number"
                inputProps={{ min: '0', max: '100' }}
                variant="filled"
                label={t('basic_data.add_employee.position_percent')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
                data-testid={dataTestId.basicData.personAdmin.positionPercent}
              />
            )}
          </Field>
        </Box>
        <Box display={{ display: 'flex', gap: '1rem' }}>
          <StartDateField
            fieldName="affiliation.startDate"
            disabled={isDisabled}
            maxDate={values.affiliation.endDate ? new Date(values.affiliation.endDate) : undefined}
            dataTestId={dataTestId.basicData.personAdmin.startDate}
          />

          <Field name="affiliation.endDate">
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <DatePicker
                disabled={isDisabled}
                label={t('common.end_date')}
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  !touched && setFieldTouched(field.name, true, false);
                  setFieldValue(field.name, date ?? '');
                }}
                views={['year', 'month', 'day']}
                minDate={values.affiliation.startDate ? new Date(values.affiliation.startDate) : undefined}
                slotProps={{
                  textField: {
                    inputProps: { 'data-testid': dataTestId.basicData.personAdmin.endDate },
                    variant: 'filled',
                    error: touched && !!error,
                    helperText: <ErrorMessage name={field.name} />,
                  },
                }}
              />
            )}
          </Field>
        </Box>
      </Box>
    </section>
  );
};
