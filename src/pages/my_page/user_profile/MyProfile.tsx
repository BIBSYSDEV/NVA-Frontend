import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { fetchPerson, updateCristinPerson } from '../../../api/cristinApi';
import { NationalIdNumberField } from '../../../components/NationalIdNumberField';
import { PageSpinner } from '../../../components/PageSpinner';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FlatCristinPerson } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { getValueByKey } from '../../../utils/user-helpers';
import { personaliaValidationSchema } from '../../../utils/validation/personalieValidation';
import { ProfilePictureUploader } from './ProfilePictureUploader';
import { UserOrcid } from './UserOrcid';

type CristinPersonFormData = Pick<FlatCristinPerson, 'preferredFirstName' | 'preferredLastName' | 'contactDetails'>;

export const MyProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked

  const personId = useSelector((store: RootState) => store.user?.cristinId) ?? '';

  const personQuery = useQuery({
    queryKey: [personId],
    queryFn: () => fetchPerson(personId),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_person'), variant: 'error' })),
  });

  const person = personQuery.data;

  const firstName = getValueByKey('FirstName', person?.names);
  const lastName = getValueByKey('LastName', person?.names);
  const personPreferredFirstName = getValueByKey('PreferredFirstName', person?.names);
  const personPreferredLastName = getValueByKey('PreferredLastName', person?.names);
  const personTelephone = person?.contactDetails?.telephone;
  const [editPreferredNames, setEditPreferredNames] = useState(false);

  const typographyStyling = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  };

  const initialValues: CristinPersonFormData = {
    preferredFirstName: personPreferredFirstName ? personPreferredFirstName : firstName,
    preferredLastName: personPreferredLastName ? personPreferredLastName : lastName,
    contactDetails: {
      telephone: personTelephone ? personTelephone : '',
      email: person?.contactDetails?.email ? person.contactDetails.email : '',
      webPage: person?.contactDetails?.webPage ? person.contactDetails.webPage : '',
    },
  };

  const updatePerson = async (values: CristinPersonFormData) => {
    if (user.cristinId) {
      const payload: CristinPersonFormData = {
        preferredFirstName: values.preferredFirstName === '' ? null : values.preferredFirstName?.trim(),
        preferredLastName: values.preferredLastName === '' ? null : values.preferredLastName?.trim(),
        contactDetails: {
          telephone: values.contactDetails?.telephone?.trim(),
          email: values.contactDetails?.email?.trim(),
          webPage: values.contactDetails?.webPage?.trim(),
        },
      };
      const updatePersonResponse = await updateCristinPerson(user.cristinId, payload);
      if (isErrorStatus(updatePersonResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_person'), variant: 'error' }));
      } else if (isSuccessStatus(updatePersonResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.update_person'), variant: 'success' }));
        setEditPreferredNames(false);
        personQuery.refetch();
      }
    }
  };

  const handleSaveAndView = async (values: CristinPersonFormData, isValid: boolean) => {
    if (isValid) {
      await updatePerson(values);
      history.push(UrlPathTemplate.MyPageResearchProfile);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('my_page.my_profile.user_profile')}</title>
      </Helmet>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'secondary.main',
          justifyContent: personQuery.isLoading ? 'start' : 'space-between',
        }}>
        <Typography variant="h2" sx={{ margin: '1rem' }}>
          {t('my_page.my_profile.heading.personalia')}
        </Typography>

        {personQuery.isLoading && !person ? (
          <PageSpinner aria-labelledby="personalia-id" />
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={personaliaValidationSchema}
            onSubmit={updatePerson}
            enableReinitialize>
            {({ isSubmitting, dirty, resetForm, values, isValid }: FormikProps<CristinPersonFormData>) => (
              <Form>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                    columnGap: '2rem',
                    ml: '1rem',
                  }}>
                  <Grid container gridColumn={1} rowGap={1} columns={16}>
                    <Grid item xs={16} md={3}>
                      <Typography fontWeight="bold" sx={typographyStyling}>
                        {t('my_page.my_profile.person_name')}
                      </Typography>
                    </Grid>
                    <Grid item xs={14} md={12}>
                      <Box
                        sx={{
                          height: '100%',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}>
                        <TextField
                          value={user.givenName}
                          disabled
                          label={t('common.first_name')}
                          size="small"
                          variant="filled"
                        />
                        <TextField
                          value={user.familyName}
                          disabled
                          label={t('common.last_name')}
                          size="small"
                          variant="filled"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography fontWeight="bold" sx={typographyStyling}>
                        {t('my_page.my_profile.preferred_name')}
                      </Typography>
                    </Grid>
                    <Grid item xs={14} md={12}>
                      <Box
                        sx={{
                          height: '100%',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          justifyContent: 'space-evenly',
                          alignItems: 'top',
                        }}>
                        <Field name={'preferredFirstName'}>
                          {({ field, meta: { error, touched } }: FieldProps<string>) => (
                            <TextField
                              {...field}
                              data-testid={dataTestId.myPage.myProfile.preferredFirstNameField}
                              id={field.name}
                              error={!!error && touched}
                              helperText={<ErrorMessage name={field.name} />}
                              disabled={!editPreferredNames || isSubmitting}
                              label={t('my_page.my_profile.preferred_first_name')}
                              size="small"
                              variant="filled"
                            />
                          )}
                        </Field>
                        <Field name={'preferredLastName'}>
                          {({ field, meta: { error, touched } }: FieldProps<string>) => (
                            <TextField
                              {...field}
                              data-testid={dataTestId.myPage.myProfile.preferredLastNameField}
                              id={field.name}
                              error={!!error && touched}
                              helperText={<ErrorMessage name={field.name} />}
                              disabled={!editPreferredNames || isSubmitting}
                              label={t('my_page.my_profile.preferred_last_name')}
                              size="small"
                              variant="filled"
                            />
                          )}
                        </Field>
                      </Box>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'start',
                          alignItems: 'center',
                        }}>
                        <Tooltip title={t('common.edit')}>
                          <IconButton
                            data-testid={dataTestId.myPage.myProfile.editPreferredNameButton}
                            onClick={() => setEditPreferredNames(!editPreferredNames)}>
                            <EditIcon sx={{ width: '1.2rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={16} md={3}>
                      <Typography fontWeight="bold" sx={typographyStyling}>
                        {t('my_page.my_profile.identity.identity_numbers')}
                      </Typography>
                    </Grid>
                    <Grid item xs={14} md={12}>
                      <Box
                        sx={{
                          height: '100%',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}>
                        <NationalIdNumberField nationalId={user.nationalIdNumber} />
                        <TextField
                          value={getIdentifierFromId(user.cristinId ?? '')}
                          disabled
                          label={t('common.id')}
                          size="small"
                          variant="filled"
                        />
                      </Box>
                    </Grid>
                    <Grid item md={13}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'start',
                          my: '0.5rem',
                        }}>
                        <Typography fontWeight={600}>{t('common.orcid')}</Typography>
                        <UserOrcid user={user} />
                      </Box>
                    </Grid>
                    <Grid item xs={16}>
                      <Typography fontWeight="bold" fontSize={15}>
                        {t('my_page.my_profile.contact_information')}
                      </Typography>
                    </Grid>
                    <Grid item xs={16} md={3}>
                      <Typography fontWeight="bold" sx={typographyStyling}>
                        {t('my_page.my_profile.telephone')}
                      </Typography>
                    </Grid>
                    <Grid item xs={14} md={12}>
                      <Field name={'contactDetails.telephone'}>
                        {({ field, meta: { error, touched } }: FieldProps<string>) => (
                          <TextField
                            {...field}
                            data-testid={dataTestId.myPage.myProfile.telephoneField}
                            label={t('my_page.my_profile.telephone')}
                            error={!!error && touched}
                            helperText={<ErrorMessage name={field.name} />}
                            disabled={isSubmitting}
                            fullWidth
                            size="small"
                            variant="filled"
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={16} md={3}>
                      <Typography fontWeight="bold" sx={typographyStyling}>
                        {t('common.email')}
                      </Typography>
                    </Grid>
                    <Grid item xs={14} md={12}>
                      <Field name={'contactDetails.email'}>
                        {({ field, meta: { error, touched } }: FieldProps<string>) => (
                          <TextField
                            {...field}
                            data-testid={dataTestId.myPage.myProfile.emailField}
                            label={t('common.email')}
                            error={!!error && touched}
                            helperText={<ErrorMessage name={field.name} />}
                            disabled={isSubmitting}
                            fullWidth
                            size="small"
                            variant="filled"
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={16} md={3}>
                      <Typography fontWeight="bold" sx={typographyStyling}>
                        {t('my_page.my_profile.personal_web_page')}
                      </Typography>
                    </Grid>
                    <Grid item xs={14} md={12}>
                      <Field name={'contactDetails.webPage'}>
                        {({ field, meta: { error, touched } }: FieldProps<string>) => (
                          <TextField
                            {...field}
                            fullWidth
                            data-testid={dataTestId.myPage.myProfile.webPageField}
                            label={t('my_page.my_profile.personal_web_page')}
                            error={!!error && touched}
                            helperText={<ErrorMessage name={field.name} />}
                            disabled={isSubmitting}
                            size="small"
                            variant="filled"
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={16}>
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: { xs: 'center', md: 'flex-start' },
                          alignItems: 'center',
                        }}>
                        <Typography variant="h3" sx={{ mb: '1rem' }}>
                          {t('my_page.my_profile.profile_picture')}
                        </Typography>
                        <ProfilePictureUploader personId={personId} />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Grid container sx={{ bgcolor: 'secondary.dark', py: '1rem', mt: '1rem' }}>
                  <Grid item xs={16} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <LoadingButton
                      variant="outlined"
                      type="submit"
                      loading={isSubmitting}
                      disabled={!dirty}
                      sx={{ boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.20)' }}
                      data-testid={dataTestId.myPage.myProfile.saveAndViewResearchProfileButton}
                      onClick={() => handleSaveAndView(values, isValid)}>
                      {t('my_page.my_profile.save_and_view_research_profile')}
                    </LoadingButton>
                  </Grid>
                  <Grid item xs={16} md={7}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: { xs: 'center', md: 'start' },
                        mt: { xs: '1rem' },
                      }}>
                      <Button
                        onClick={() => {
                          resetForm();
                        }}>
                        {t('common.cancel')}
                      </Button>
                      <LoadingButton
                        data-testid={dataTestId.myPage.myProfile.saveProfileChangesButton}
                        loading={isSubmitting}
                        disabled={!dirty}
                        variant="contained"
                        type="submit">
                        {t('common.save')}
                      </LoadingButton>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </>
  );
};
