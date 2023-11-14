import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { FlatCristinPerson } from '../../../types/user.types';
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

              <FormControlLabel
                onChange={() => {
                  const newPerson: FlatCristinPerson = {
                    ...values.user,
                    nvi: {
                      verifiedAt: { id: !confirmedIdentity ? userTopLevelOrg : '' },
                      verifiedBy: { id: !confirmedIdentity ? userCristinId : '' },
                    },
                    nationalId: '',
                  };
                  setFieldValue('user', newPerson);
                }}
                control={<Checkbox disabled={isSubmitting} checked={confirmedIdentity} />}
                label={t('basic_data.add_employee.confirmed_identity')}
              />

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
