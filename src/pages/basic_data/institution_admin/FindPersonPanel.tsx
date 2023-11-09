import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
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
  const confirmedIdentity = !!values.user.nvi?.verifiedAt.id && !!values.user.nvi?.verifiedBy.id;

  const user = useSelector((store: RootState) => store.user);
  const userCristinId = user?.cristinId ?? '';
  const userTopLevelOrg = user?.topOrgCristinId ?? '';

  const setSelectedPerson = useCallback(
    (person?: FlatCristinPerson) => setFieldValue('user', person ? person : emptyUser),
    [setFieldValue]
  );

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

              <Field name="user.nvi.verifiedAt.id">
                {({ field, form }: FieldProps<NviVerification>) => (
                  <FormControlLabel
                    sx={{ whiteSpace: 'pre-line' }}
                    control={
                      <Checkbox
                        {...field}
                        value={values.user.nvi}
                        onChange={() => {
                          setFieldValue('user.nvi.verifiedBy.id', !confirmedIdentity ? userCristinId : '', false);
                          setFieldValue('user.nationalId', '', false);
                          setFieldValue(field.name, !confirmedIdentity ? userTopLevelOrg : '');
                        }}
                      />
                    }
                    label={t('basic_data.add_employee.confirmed_identity')}
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
