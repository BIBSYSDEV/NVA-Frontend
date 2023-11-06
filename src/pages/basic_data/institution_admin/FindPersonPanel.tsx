import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Button, Checkbox, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { FlatCristinPerson, NviVerification } from '../../../types/user.types';
import { SearchForCristinPerson } from '../SearchForCristinPerson';
import { AddEmployeeData, emptyUser } from './AddEmployeePage';

export const FindPersonPanel = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, isSubmitting } = useFormikContext<AddEmployeeData>();
  const [showCreatePerson, setShowCreatePerson] = useState(false);
  const [confirmedIdentity, setConfirmedIdentity] = useState(false);

  const user = useSelector((store: RootState) => store.user);
  const userCristinId = user?.cristinId ?? '';
  const userTopLevelOrg = user?.topOrgCristinId ?? '';

  const setSelectedPerson = useCallback(
    (person?: FlatCristinPerson) => setFieldValue('user', person ? person : emptyUser),
    [setFieldValue]
  );

  console.log(values.user.nvi);

  return (
    <>
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
                    disabled={isSubmitting || confirmedIdentity}
                    required={!confirmedIdentity}
                    fullWidth
                    variant="filled"
                    label={t('basic_data.person_register.national_identity_number')}
                    value={values.user.nationalId}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>

              <Field name="user.nvi">
                {({ field }: FieldProps<NviVerification>) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      {...field}
                      value={values.user.nvi}
                      onChange={() => {
                        setConfirmedIdentity(!confirmedIdentity);
                        setFieldValue(field.name, {
                          verifiedBy: { id: !confirmedIdentity ? userCristinId : '' },
                          verifiedAt: { id: !confirmedIdentity ? userTopLevelOrg : '' },
                        });
                        setFieldValue('user.nationalId', '');
                      }}
                    />
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                      {t('basic_data.add_employee.confirmed_identity')}
                    </Typography>
                  </Box>
                )}
              </Field>
            </>
          )}
        </>
      )}
    </>
  );
};
