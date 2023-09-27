import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerson, updateCristinPerson } from '../../../api/cristinApi';
import { PageSpinner } from '../../../components/PageSpinner';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FlatCristinPerson } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { filterActiveAffiliations, getValueByKey } from '../../../utils/user-helpers';
import { ProfilePictureUploader } from './ProfilePictureUploader';
import { ResearchProfilePanel } from './ResearchProfilePanel';
import { UserIdentity } from './UserIdentity';

type CristinPersonFormData = Pick<FlatCristinPerson, 'preferredFirstName' | 'preferredLastName'>;

export const MyProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked

  const personId = useSelector((store: RootState) => store.user?.cristinId) ?? '';

  const personQuery = useQuery({
    queryKey: [personId],
    queryFn: () => fetchPerson(personId),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_person'), variant: 'error' })),
  });
  const person = personQuery.data;

  const hasActiveEmployment = filterActiveAffiliations(person?.affiliations).length > 0;

  const firstName = getValueByKey('FirstName', person?.names);
  const lastName = getValueByKey('LastName', person?.names);
  const personPreferredFirstName = getValueByKey('PreferredFirstName', person?.names);
  const personPreferredLastName = getValueByKey('PreferredLastName', person?.names);
  const [editPreferredNames, setEditPreferredNames] = useState(false);
  const personTelephone = person?.contactDetails?.telephone;

  const initialValues: CristinPersonFormData = {
    preferredFirstName: personPreferredFirstName ? personPreferredFirstName : firstName,
    preferredLastName: personPreferredLastName ? personPreferredLastName : lastName,
  };

  const updatePerson = async (values: CristinPersonFormData) => {
    if (user.cristinId) {
      const payload: CristinPersonFormData = {
        preferredFirstName: values.preferredFirstName === '' ? null : values.preferredFirstName?.trim(),
        preferredLastName: values.preferredLastName === '' ? null : values.preferredLastName?.trim(),
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
          columnGap: '1rem',
          gridTemplateAreas: {
            xs: '"user-profile" "user-identity" "research-profile"',
            md: '"user-profile research-profile" "user-identity research-profile" ',
          },
        }}>
        <BackgroundDiv
          sx={{
            bgcolor: 'info.light',
            gridArea: 'user-profile',
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Typography variant="h2" id="personalia-id">
              {t('my_page.my_profile.heading.personalia')}
            </Typography>
            {personQuery.isLoading && !person ? (
              <PageSpinner aria-labelledby="personalia-id" />
            ) : (
              <>
                <Typography>{t('my_page.my_profile.user_profile_description')}</Typography>
                <Formik initialValues={initialValues} onSubmit={updatePerson} enableReinitialize>
                  {({ isSubmitting, dirty, resetForm }: FormikProps<CristinPersonFormData>) => {
                    return (
                      <Form>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateAreas: {
                              xs: '"user-info" "profile-picture"',
                              md: '"user-info profile-picture"',
                            },
                            gridTemplateColumns: { xs: '1fr', md: '2fr auto' },
                            columnGap: '2rem',
                          }}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',

                              gridArea: 'user-info',
                            }}>
                            <Box sx={{ display: 'flex', gap: '1rem' }}>
                              <Field name={'preferredFirstName'}>
                                {({ field }: FieldProps<string>) => (
                                  <TextField
                                    {...field}
                                    data-testid={dataTestId.myPage.myProfile.preferredFirstNameField}
                                    id={field.name}
                                    disabled={!editPreferredNames || isSubmitting}
                                    label={t('my_page.my_profile.preferred_first_name')}
                                    size="small"
                                    variant="filled"
                                  />
                                )}
                              </Field>
                              <Field name={'preferredLastName'}>
                                {({ field }: FieldProps<string>) => (
                                  <TextField
                                    {...field}
                                    data-testid={dataTestId.myPage.myProfile.preferredLastNameField}
                                    id={field.name}
                                    disabled={!editPreferredNames || isSubmitting}
                                    label={t('my_page.my_profile.preferred_last_name')}
                                    size="small"
                                    variant="filled"
                                  />
                                )}
                              </Field>
                              <Tooltip title={t('common.edit')}>
                                <IconButton
                                  data-testid={dataTestId.myPage.myProfile.editPreferredNameButton}
                                  onClick={() => setEditPreferredNames(!editPreferredNames)}>
                                  <EditIcon sx={{ width: '1.2rem' }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            <TextField
                              sx={{ width: 'fit-content' }}
                              value={personTelephone}
                              data-testid={dataTestId.myPage.myProfile.telephoneField}
                              disabled
                              label={t('my_page.my_profile.telephone')}
                              size="small"
                              variant="filled"
                            />
                          </Box>

                          <Box
                            sx={{
                              gridArea: 'profile-picture',
                            }}>
                            <Typography variant="h3" sx={{ alignSelf: 'start', my: '1rem' }}>
                              {t('my_page.my_profile.profile_picture')}
                            </Typography>
                            <ProfilePictureUploader id={personId} />
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '1rem', gap: '1rem' }}>
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
                    );
                  }}
                </Formik>
              </>
            )}
          </Box>
        </BackgroundDiv>
        <UserIdentity user={user} hasActiveEmployment={hasActiveEmployment} />

        <Box sx={{ gridArea: 'research-profile' }}>
          <ResearchProfilePanel person={person} isLoadingPerson={personQuery.isLoading} />
        </Box>
      </Box>
    </>
  );
};
