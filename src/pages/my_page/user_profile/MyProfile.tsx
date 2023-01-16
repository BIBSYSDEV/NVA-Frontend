import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';
import { ResearchProfilePanel } from './ResearchProfilePanel';
import { RootState } from '../../../redux/store';
import { setNotification } from '../../../redux/notificationSlice';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { PageSpinner } from '../../../components/PageSpinner';
import { CristinPerson, FlatCristinPerson } from '../../../types/user.types';
import { updateCristinPerson } from '../../../api/userApi';
import { useFetch } from '../../../utils/hooks/useFetch';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { getValueByKey } from '../../../utils/user-helpers';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';

export const MyProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked

  const personId = useSelector((store: RootState) => store.user?.cristinId) ?? '';

  const [person, isLoadingPerson, refetchPerson] = useFetch<CristinPerson>({
    url: personId,
    errorMessage: t('feedback.error.get_person'),
  });

  const firstName = getValueByKey('FirstName', person?.names);
  const lastName = getValueByKey('LastName', person?.names);
  const personPreferredFirstName = getValueByKey('PreferredFirstName', person?.names);
  const personPreferredLastName = getValueByKey('PreferredLastName', person?.names);
  const [editPreferredNames, setEditPreferredNames] = useState(false);

  type CristinPersonFormData = Pick<FlatCristinPerson, 'preferredFirstName' | 'preferredLastName'>;

  const initialValues: CristinPersonFormData = {
    preferredFirstName: personPreferredFirstName ? personPreferredFirstName : firstName,
    preferredLastName: personPreferredLastName ? personPreferredLastName : lastName,
  };

  const updatePerson = async (values: CristinPersonFormData) => {
    if (user.cristinId) {
      values.preferredFirstName = values.preferredFirstName?.trim();
      values.preferredLastName = values.preferredLastName?.trim();
      if (values.preferredFirstName === '') {
        values.preferredFirstName = null;
      }
      if (values.preferredLastName === '') {
        values.preferredLastName = null;
      }
      const updatePersonResponse = await updateCristinPerson(user.cristinId, values);
      if (isErrorStatus(updatePersonResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_person'), variant: 'error' }));
      } else if (isSuccessStatus(updatePersonResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.update_person'), variant: 'success' }));
        setEditPreferredNames(false);
        refetchPerson();
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('my_page.my_profile.user_profile')}</title>
      </Helmet>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '3fr 1fr',
          },
          gap: '1rem',
          gridTemplateAreas: {
            xs: '"user-profile" "research-profile"',
            md: '"user-profile research-profile" ',
          },
        }}>
        <BackgroundDiv
          sx={{
            display: 'grid',
            gridTemplateAreas: {
              xs: '"primary-info" "roles"',
              md: '"roles" "primary-info"',
            },
            bgcolor: 'info.light',
            gridArea: 'user-profile',
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Typography variant="h2">{t('my_page.my_profile.heading.personalia')}</Typography>
            {isLoadingPerson && !person ? (
              <PageSpinner />
            ) : (
              <>
                <Typography>{t('my_page.my_profile.user_profile_description')}</Typography>
                <Formik initialValues={initialValues} onSubmit={updatePerson} enableReinitialize>
                  {({ isSubmitting, dirty }: FormikProps<CristinPersonFormData>) => (
                    <Form>
                      <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Field name={'preferredFirstName'}>
                          {({ field, meta: { touched, error } }: FieldProps<string>) => (
                            <TextField
                              {...field}
                              id={field.name}
                              disabled={!editPreferredNames || isSubmitting}
                              label={t('my_page.my_profile.preferred_first_name')}
                              size="small"
                              variant="filled"
                              error={touched && !!error}
                              helperText={<ErrorMessage name={field.name} />}
                            />
                          )}
                        </Field>
                        <Field name={'preferredLastName'}>
                          {({ field, meta: { touched, error } }: FieldProps<string>) => (
                            <TextField
                              {...field}
                              id={field.name}
                              disabled={!editPreferredNames || isSubmitting}
                              label={t('my_page.my_profile.preferred_last_name')}
                              size="small"
                              variant="filled"
                              error={touched && !!error}
                              helperText={<ErrorMessage name={field.name} />}
                            />
                          )}
                        </Field>
                        <Tooltip title={t('common.edit')}>
                          <IconButton onClick={() => setEditPreferredNames(!editPreferredNames)}>
                            <EditIcon sx={{ width: '1.2rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ mt: '0.6rem' }}>{t('common.orcid')}</Typography>
                        <UserOrcid user={user} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                          {t('common.save')}
                        </LoadingButton>
                      </Box>
                      <Box sx={{ gridArea: 'roles' }}>
                        <UserRoles user={user} />
                      </Box>
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </Box>
        </BackgroundDiv>
        <Box sx={{ gridArea: 'research-profile' }}>
          <ResearchProfilePanel person={person} isLoadingPerson={isLoadingPerson} />
        </Box>
      </Box>
    </>
  );
};
