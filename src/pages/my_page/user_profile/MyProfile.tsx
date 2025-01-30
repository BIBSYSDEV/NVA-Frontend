import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerson, updateCristinPerson } from '../../../api/cristinApi';
import { DocumentHeadTitle } from '../../../components/DocumentHeadTitle';
import { NationalIdNumberField } from '../../../components/NationalIdNumberField';
import { PageSpinner } from '../../../components/PageSpinner';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FlatCristinPerson } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getValueByKey } from '../../../utils/user-helpers';
import { personaliaValidationSchema } from '../../../utils/validation/personaliaValidation';
import { ProfilePictureUploader } from './ProfilePictureUploader';
import { ProfileBox, StyledGridBox } from './styles';
import { UserOrcid } from './UserOrcid';
import { UserOrcidHelperModal } from './UserOrcidHelperModal';

type CristinPersonFormData = Pick<FlatCristinPerson, 'preferredFirstName' | 'preferredLastName' | 'contactDetails'>;

export const MyProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked

  const personId = user?.cristinId ?? '';

  const personQuery = useQuery({
    enabled: !!personId,
    queryKey: ['person', personId],
    queryFn: () => fetchPerson(personId),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const person = personQuery.data;

  const firstName = getValueByKey('FirstName', person?.names);
  const lastName = getValueByKey('LastName', person?.names);
  const personPreferredFirstName = getValueByKey('PreferredFirstName', person?.names);
  const personPreferredLastName = getValueByKey('PreferredLastName', person?.names);
  const [editPreferredNames, setEditPreferredNames] = useState(false);

  const initialValues: CristinPersonFormData = {
    preferredFirstName: personPreferredFirstName ? personPreferredFirstName : firstName,
    preferredLastName: personPreferredLastName ? personPreferredLastName : lastName,
    contactDetails: {
      telephone: person?.contactDetails?.telephone ?? '',
      email: person?.contactDetails?.email ?? '',
      webPage: person?.contactDetails?.webPage ?? '',
    },
  };

  const updatePerson = async (values: CristinPersonFormData) => {
    if (user.cristinId) {
      const payload: CristinPersonFormData = {
        preferredFirstName: values.preferredFirstName?.trim() || null,
        preferredLastName: values.preferredLastName?.trim() || null,
        contactDetails: {
          telephone: values.contactDetails?.telephone?.trim() || null,
          email: values.contactDetails?.email?.trim() || null,
          webPage: values.contactDetails?.webPage?.trim() || null,
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

  return (
    <Box sx={{ bgcolor: 'secondary.main' }}>
      <DocumentHeadTitle>{t('my_page.my_profile.heading.personalia')}</DocumentHeadTitle>

      <Typography variant="h2" sx={{ margin: '1rem' }}>
        {t('my_page.my_profile.heading.personalia')}
      </Typography>

      {personQuery.isPending && !person ? (
        <PageSpinner aria-labelledby="personalia-id" />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={personaliaValidationSchema}
          onSubmit={updatePerson}
          enableReinitialize>
          {({ isSubmitting, dirty, resetForm }: FormikProps<CristinPersonFormData>) => (
            <Form>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                  columnGap: '0.5rem',
                  rowGap: '0.5rem',
                  gridTemplateAreas: {
                    xs: '"profile-picture" "personalia-details"',
                    lg: '"personalia-details profile-picture"',
                  },
                  m: '1rem',
                }}>
                <Grid container rowGap={1} columns={16} sx={{ gridArea: 'personalia-details' }}>
                  <Grid item xs={16}>
                    <ProfileBox>
                      <Typography fontWeight="bold" sx={{ mb: '0.5rem' }}>
                        {t('my_page.my_profile.name')}
                      </Typography>
                      <Typography sx={{ mb: '0.5rem' }}>{t('my_page.my_profile.name_description')}</Typography>
                      <Typography sx={{ mb: '1.5rem' }}>{t('my_page.my_profile.writer_name_description')}</Typography>
                      <Grid item xs={15}>
                        <StyledGridBox sx={{ mb: '1rem' }}>
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
                        </StyledGridBox>
                      </Grid>
                      <Grid item xs={16}>
                        <Grid container columns={16}>
                          <Grid item xs={15}>
                            <StyledGridBox>
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
                            </StyledGridBox>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title={t('common.edit')}>
                              <IconButton
                                data-testid={dataTestId.myPage.myProfile.editPreferredNameButton}
                                onClick={() => setEditPreferredNames(!editPreferredNames)}>
                                <EditIcon sx={{ width: '1.2rem' }} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ProfileBox>
                  </Grid>
                  <Grid item xs={16}>
                    <ProfileBox>
                      <Typography fontWeight="bold" sx={{ mb: '0.5rem' }}>
                        {t('my_page.my_profile.identity.identity_numbers')}
                      </Typography>
                      <Typography sx={{ mb: '1rem' }}>
                        {t('my_page.my_profile.identity_numbers_description')}
                      </Typography>
                      <StyledGridBox>
                        <NationalIdNumberField nationalId={user.nationalIdNumber} />
                        <TextField
                          value={getIdentifierFromId(personId ?? '')}
                          disabled
                          label={t('common.person_id')}
                          size="small"
                          variant="filled"
                        />
                      </StyledGridBox>
                    </ProfileBox>
                  </Grid>
                  <Grid item xs={16}>
                    <ProfileBox>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: '0.5rem' }}>
                        <Typography fontWeight="bold">{t('common.orcid')}</Typography>
                        <UserOrcidHelperModal />
                      </Box>
                      <Trans
                        i18nKey="my_page.my_profile.orcid_is_voluntary"
                        components={[<Typography key="1" gutterBottom />]}
                      />
                      <UserOrcid user={user} sx={{ mt: '1rem' }} />
                    </ProfileBox>
                  </Grid>
                  <Grid item xs={16}>
                    <ProfileBox>
                      <Typography sx={{ mb: '0.5rem' }} fontWeight="bold">
                        {t('my_page.my_profile.contact_information')}
                      </Typography>
                      <Trans
                        i18nKey="my_page.my_profile.contact_information_is_voluntary"
                        components={[<Typography key="1" gutterBottom />]}
                      />
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
                            sx={{ mt: '1rem' }}
                          />
                        )}
                      </Field>
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
                            sx={{ mt: '1rem' }}
                          />
                        )}
                      </Field>
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
                            sx={{ mt: '1rem' }}
                          />
                        )}
                      </Field>
                    </ProfileBox>
                  </Grid>
                </Grid>
                <Grid item>
                  <ProfileBox sx={{ gridArea: 'profile-picture', alignItems: 'center' }}>
                    <Typography variant="h3" sx={{ mb: '1rem' }}>
                      {t('my_page.my_profile.profile_picture')}
                    </Typography>
                    <Trans
                      i18nKey="my_page.my_profile.upload_is_not_mandatory"
                      components={[<Typography key="1" gutterBottom sx={{ textAlign: 'center' }} />]}
                    />
                    <ProfilePictureUploader personId={personId} />
                    <Trans
                      i18nKey="my_page.my_profile.upload_description"
                      components={[<Typography key="1" gutterBottom sx={{ textAlign: 'center' }} />]}
                    />
                  </ProfileBox>
                </Grid>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  py: '1rem',
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
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};
