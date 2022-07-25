import { Button, TextField, Typography } from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOneOutlined';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useCallback, useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { StyledCenterContainer } from '../../../components/styled/Wrappers';
import { AddEmployeeData, emptyUser } from './AddEmployeePage';
import { SearchForCristinPerson } from '../SearchForCristinPerson';

export const FindPersonPanel = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, isSubmitting } = useFormikContext<AddEmployeeData>();
  const [showCreatePerson, setShowCreatePerson] = useState(false);

  const setSelectedPerson = useCallback(
    (person) => setFieldValue('user', person ? person : emptyUser),
    [setFieldValue]
  );

  return (
    <>
      <StyledCenterContainer>
        <LooksOneIcon color="primary" fontSize="large" sx={{ float: 'center' }} />
      </StyledCenterContainer>

      <SearchForCristinPerson
        selectedPerson={values.user}
        setSelectedPerson={setSelectedPerson}
        disabled={isSubmitting}
      />
      {!values.user.id && (
        <>
          <Typography>{t('basic_data.add_employee.no_matching_persons_found')}</Typography>
          {!showCreatePerson ? (
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              sx={{ width: 'fit-content' }}
              onClick={() => setShowCreatePerson(true)}>
              {t('basic_data.add_employee.create_person')}
            </Button>
          ) : (
            <>
              <Typography variant="h3">{t('basic_data.add_employee.create_person')}</Typography>
              <Field name="user.firstName">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    disabled={isSubmitting}
                    required
                    fullWidth
                    variant="filled"
                    label={t('common.first_name')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="user.lastName">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    disabled={isSubmitting}
                    required
                    fullWidth
                    variant="filled"
                    label={t('common.last_name')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="user.nationalId">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    variant="filled"
                    label={t('basic_data.national_id')}
                    value={values.user.nationalId}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
            </>
          )}
        </>
      )}
    </>
  );
};
