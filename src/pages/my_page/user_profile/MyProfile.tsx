import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, IconButton, styled, TextField, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerson, updateCristinPerson } from '../../../api/cristinApi';
import { NationalIdNumberField } from '../../../components/NationalIdNumberField';
import { PageSpinner } from '../../../components/PageSpinner';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { FlatCristinPerson } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getOrcidUri, getValueByKey } from '../../../utils/user-helpers';
import { personaliaValidationSchema } from '../../../utils/validation/personaliaValidation';
import { ProfilePictureUploader } from './ProfilePictureUploader';
import { UserOrcid } from './UserOrcid';
import { UserOrcidHelperModal } from './UserOrcidHelperModal';

type CristinPersonFormData = Pick<FlatCristinPerson, 'preferredFirstName' | 'preferredLastName' | 'contactDetails'>;

const StyledTypography = styled(Typography)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
});

const StyledGridBox = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
});

export const MyProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  const orcidUri = getOrcidUri(person?.identifiers);

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
      <Helmet>
        <title>{t('my_page.my_profile.user_profile')}</title>
      </Helmet>

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
                  gridTemplateAreas: {
                    xs: '"profile-picture" "personalia-details"',
                    lg: '"personalia-details profile-picture"',
                  },
                  m: '1rem',
                }}>
                <Grid container rowGap={1} columns={16} sx={{ gridArea: 'personalia-details' }}>
                  <Grid item xs={16} md={3}>
                    <StyledTypography>{t('my_page.my_profile.person_name')}</StyledTypography>
                  </Grid>
                  <Grid item xs={14} md={12}>
                    <StyledGridBox>
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
                  <Grid item xs={12} md={3}>
                    <StyledTypography>{t('my_page.my_profile.preferred_name')}</StyledTypography>
                  </Grid>
                  <Grid item xs={14} md={12}>
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
                  <Grid item xs={1} md={1}>
                    <Tooltip title={t('common.edit')}>
                      <IconButton
                        data-testid={dataTestId.myPage.myProfile.editPreferredNameButton}
                        onClick={() => setEditPreferredNames(!editPreferredNames)}>
                        <EditIcon sx={{ width: '1.2rem' }} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={16} md={3}>
                    <StyledTypography>{t('my_page.my_profile.identity.identity_numbers')}</StyledTypography>
                  </Grid>
                  <Grid item xs={14} md={12}>
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
                  </Grid>
                  <Grid item md={16}>
                    <Grid alignItems="center" container columns={16} spacing={1}>
                      <Grid item xs={16} md={3}>
                        <Box sx={{ display: 'flex', direction: 'column', alignItems: 'center' }}>
                          <Typography fontWeight="bold">{t('common.orcid')}</Typography>
                          <img src={orcidIcon} height="20" alt="" />
                          <UserOrcidHelperModal />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={13}>
                        <Box
                          sx={{
                            display: 'flex',
                            direction: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}>
                          <UserOrcid user={user} />
                          {!orcidUri && <Typography>{t('my_page.my_profile.orcid.orcid_description')}</Typography>}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={16}>
                    <Typography fontWeight="bold">{t('my_page.my_profile.contact_information')}</Typography>
                  </Grid>
                  <Grid item xs={16} md={3}>
                    <StyledTypography>{t('my_page.my_profile.telephone')}</StyledTypography>
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
                    <StyledTypography>{t('common.email')}</StyledTypography>
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
                    <StyledTypography>{t('my_page.my_profile.personal_web_page')}</StyledTypography>
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

                <Box
                  sx={{
                    gridArea: 'profile-picture',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: { xs: '1rem', lg: 0 },
                  }}>
                  <Typography variant="h3" sx={{ mb: '1rem' }}>
                    {t('my_page.my_profile.profile_picture')}
                  </Typography>
                  <ProfilePictureUploader personId={personId} />
                </Box>
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
