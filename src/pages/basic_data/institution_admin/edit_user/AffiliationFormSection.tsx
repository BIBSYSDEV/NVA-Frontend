import CancelIcon from '@mui/icons-material/Cancel';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchPositions } from '../../../../api/cristinApi';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { CristinPerson } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { PositionField } from '../../fields/PositionField';
import { StartDateField } from '../../fields/StartDateField';
import { UserFormData, UserFormFieldName } from './userFormHelpers';

export const AffiliationFormSection = () => {
  const { t } = useTranslation();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const toggleConfirmDeleteDialog = () => setOpenConfirmDeleteDialog(!openConfirmDeleteDialog);

  const { values, errors, touched, setFieldValue, isSubmitting } = useFormikContext<UserFormData>();
  const employments = values.person?.employments ?? [];

  const [employmentIndex, setEmploymentIndex] = useState(0);

  const positionsQuery = useQuery({
    queryKey: ['positions', true],
    queryFn: () => fetchPositions(true),
    meta: { errorMessage: t('feedback.error.get_positions') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });

  const employmentBaseFieldName = `${UserFormFieldName.Employments}[${employmentIndex}]`;

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('common.employments')}
      </Typography>
      {employments.length === 0 ? (
        <Typography>{t('my_page.no_employments')}</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Field
            name={`${employmentBaseFieldName}.organization`}
            data-testid={dataTestId.basicData.personAdmin.employments()}>
            {({ field }: FieldProps<string>) => <AffiliationHierarchy unitUri={field.value} commaSeparated />}
          </Field>

          <Box display={{ display: 'flex', gap: '1rem' }}>
            <PositionField
              fieldName={`${employmentBaseFieldName}.type`}
              disabled={isSubmitting || positionsQuery.isPending}
              includeDisabledPositions
            />

            <Field name={`${employmentBaseFieldName}.fullTimeEquivalentPercentage`}>
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  disabled={isSubmitting}
                  fullWidth
                  type="number"
                  variant="filled"
                  label={t('basic_data.add_employee.position_percent')}
                  error={touched && !!error}
                  helperText={touched && error}
                  data-testid={dataTestId.basicData.personAdmin.positionPercent}
                  slotProps={{ htmlInput: { min: '0', max: '100' } }}
                />
              )}
            </Field>
          </Box>
          <Box display={{ display: 'flex', gap: '1rem' }}>
            <StartDateField
              fieldName={`${employmentBaseFieldName}.startDate`}
              disabled={isSubmitting}
              maxDate={
                employments[employmentIndex].endDate ? new Date(employments[employmentIndex].endDate) : undefined
              }
              dataTestId={dataTestId.basicData.personAdmin.startDate}
            />

            <Field name={`${employmentBaseFieldName}.endDate`} data-testid={dataTestId.basicData.personAdmin.endDate}>
              {({ field, meta: { error, touched } }: FieldProps<string>) => (
                <DatePicker
                  disabled={isSubmitting}
                  label={t('common.end_date')}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(date: any) => setFieldValue(field.name, date ?? '')}
                  views={['year', 'month', 'day']}
                  minDate={
                    employments[employmentIndex].startDate
                      ? new Date(employments[employmentIndex].startDate)
                      : undefined
                  }
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
          <Button
            disabled={isSubmitting}
            color="error"
            variant="outlined"
            onClick={toggleConfirmDeleteDialog}
            endIcon={<CancelIcon />}
            data-testid={dataTestId.basicData.personAdmin.removeEmployment}>
            {t('basic_data.person_register.remove_employment')}
          </Button>
          {employments.length > 1 && (
            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', alignSelf: 'center' }}>
              <IconButton
                title={t('common.previous')}
                disabled={employmentIndex === 0}
                onClick={() => setEmploymentIndex(employmentIndex - 1)}>
                <NavigateBeforeIcon />
              </IconButton>
              <Typography>
                {t('basic_data.person_register.employment_x_of_y', {
                  selected: employmentIndex + 1,
                  total: employments.length,
                })}
              </Typography>
              <IconButton
                title={t('common.next')}
                disabled={employmentIndex === employments.length - 1}
                onClick={() => setEmploymentIndex(employmentIndex + 1)}>
                <NavigateNextIcon />
              </IconButton>
            </Box>
          )}

          {!!(errors.person as FormikErrors<Partial<CristinPerson> | undefined>)?.employments &&
            !!(touched.person as FormikTouched<Partial<CristinPerson> | undefined>)?.employments && (
              <Typography color="error">{t('feedback.validation.employments_missing_data')}</Typography>
            )}
        </Box>
      )}

      <ConfirmDialog
        open={openConfirmDeleteDialog}
        title={t('basic_data.person_register.remove_employment_title')}
        onAccept={() => {
          const filteredEmployments = employments.filter((_, index) => index !== employmentIndex);
          setFieldValue(UserFormFieldName.Employments, filteredEmployments);
          setEmploymentIndex(employmentIndex !== 0 ? employmentIndex - 1 : 0);
          toggleConfirmDeleteDialog();
        }}
        onCancel={toggleConfirmDeleteDialog}>
        <Typography>{t('basic_data.person_register.remove_employment_text')}</Typography>
      </ConfirmDialog>
    </section>
  );
};
