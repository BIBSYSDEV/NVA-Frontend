import { Autocomplete, Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LooksTwoIcon from '@mui/icons-material/LooksTwoOutlined';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';
import { useSelector } from 'react-redux';
import { StyledCenterContainer } from '../../../components/styled/Wrappers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { RootState } from '../../../redux/store';
import { Organization } from '../../../types/organization.types';
import { useFetchResource } from '../../../utils/hooks/useFetchResource';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { AddEmployeeData } from './AddEmployeePage';
import { StartDateField } from '../fields/StartDateField';
import { PositionField } from '../fields/PositionField';

export const AddAffiliationPanel = () => {
  const { t } = useTranslation();
  const { values, errors, setFieldValue, isSubmitting } = useFormikContext<AddEmployeeData>();
  const user = useSelector((store: RootState) => store.user);
  const [currentOrganization, isLoadingCurrentOrganization] = useFetchResource<Organization>(
    user?.topOrgCristinId ?? ''
  );
  const organizationOptions = currentOrganization ? getSortedSubUnits([currentOrganization]) : [];

  const isDisabled = !!errors.user?.firstName || !!errors.user?.lastName || !!errors.user?.nationalId || isSubmitting;

  return (
    <>
      <StyledCenterContainer>
        <LooksTwoIcon color="primary" fontSize="large" />
      </StyledCenterContainer>
      <Field name="affiliation.organization">
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <Autocomplete
            disabled={isDisabled}
            value={organizationOptions.find((option) => option.id === field.value) ?? null}
            options={organizationOptions}
            getOptionLabel={(option) => getLanguageString(option.name)}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {getLanguageString(option.name)}
              </li>
            )}
            loading={isLoadingCurrentOrganization}
            onChange={(_, value) => setFieldValue(field.name, value?.id)}
            renderInput={(params) => (
              <TextField
                {...field}
                {...params}
                required
                label={t('common.institution')}
                variant="filled"
                fullWidth
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
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
              required
              disabled={isDisabled}
              fullWidth
              type="number"
              inputProps={{ min: '0', max: '100' }}
              variant="filled"
              label={t('basic_data.add_employee.position_percent')}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </Box>
      <Box display={{ display: 'flex', gap: '1rem' }}>
        <StartDateField
          fieldName="affiliation.startDate"
          disabled={isDisabled}
          maxDate={values.affiliation.endDate ? new Date(values.affiliation.endDate) : undefined}
        />

        <Field name="affiliation.endDate">
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <DatePicker
              disabled={isDisabled}
              label={t('common.end_date')}
              PopperProps={{
                'aria-label': t('common.end_date'),
              }}
              value={field.value ? field.value : null}
              onChange={(date) => setFieldValue(field.name, date ?? '')}
              inputFormat="dd.MM.yyyy"
              views={['year', 'month', 'day']}
              mask="__.__.____"
              minDate={values.affiliation.startDate ? new Date(values.affiliation.startDate) : undefined}
              renderInput={(params) => (
                <TextField
                  {...field}
                  {...params}
                  variant="filled"
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            />
          )}
        </Field>
      </Box>
    </>
  );
};
