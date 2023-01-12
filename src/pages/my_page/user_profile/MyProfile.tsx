import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { RootState } from '../../../redux/store';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';
import { BackgroundDiv, InputContainerBox } from '../../../components/styled/Wrappers';
import { ResearchProfilePanel } from './ResearchProfilePanel';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { CristinPerson, FlatCristinPerson } from '../../../types/user.types';
import { updateCristinPerson } from '../../../api/userApi';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useFetch } from '../../../utils/hooks/useFetch';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { useLocation } from 'react-router-dom';
import { PageSpinner } from '../../../components/PageSpinner';
import { getValueByKey } from '../../../utils/user-helpers';

export const MyProfile = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked
  const firstName = user?.givenName;
  const lastName = user?.familyName;

  const [editPreferredFirstName, setEditPreferredFirstName] = useState(false);
  const [editPreferredLastName, setEditPreferredLastName] = useState(false);

  const currentCristinId = useSelector((store: RootState) => store.user?.cristinId) ?? '';
  const isPublicPage = location.pathname === UrlPathTemplate.ResearchProfile;
  const personId = isPublicPage
    ? new URLSearchParams(location.search).get('id') ?? '' // Page for Research Profile of anyone
    : currentCristinId; // Page for My Research Profile

  const [person, isLoadingPerson] = useFetch<CristinPerson>({
    url: personId,
    errorMessage: t('feedback.error.get_person'),
  });

  const personPreferredFirstName = getValueByKey('PreferredFirstName', person?.names);
  const personPreferredLastName = getValueByKey('PreferredLastName', person?.names);

  type CristinPersonFormData = Pick<FlatCristinPerson, 'preferredFirstName' | 'preferredLastName'>;

  const initialValues: CristinPersonFormData = {
    preferredFirstName: personPreferredFirstName ?? firstName,
    preferredLastName: personPreferredLastName ?? lastName,
  };

  const updatePerson = async (values: CristinPersonFormData) => {
    if (user.cristinId) {
      await updateCristinPerson(user.cristinId, values);
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
            gridTemplateColumns: { xs: '1fr', md: '1fr' },
            gridTemplateRows: { xs: '1fr', md: '1fr' },
            bgcolor: 'info.light',
            gridArea: 'user-profile',
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Typography variant="h2">{t('my_page.my_profile.heading.personalia')}</Typography>
            <Typography>{t('my_page.my_profile.user-profile-description')}</Typography>
            {isLoadingPerson ? (
              <PageSpinner />
            ) : (
              <Box>
                <Typography>{t('my_page.my_profile.author_name')}</Typography>
                <Formik initialValues={initialValues} onSubmit={(values) => updatePerson(values)}>
                  <Form>
                    <InputContainerBox sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Field name={'preferredFirstName'}>
                        {({ field, meta: { touched, error } }: FieldProps<string>) => (
                          <TextField
                            {...field}
                            id={field.name}
                            value={field.value ?? firstName}
                            required
                            disabled={!editPreferredFirstName}
                            label={t('common.first_name')}
                            size="small"
                            variant="filled"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    sx={{ bgcolor: 'info.light', borderRadius: '50%', padding: '0.2rem' }}
                                    aria-label={t('common.edit')}
                                    onClick={() => setEditPreferredFirstName(!editPreferredFirstName)}>
                                    <EditIcon sx={{ width: '1.2rem', height: '1.2rem' }} />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
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
                            value={field.value ?? lastName}
                            required
                            disabled={!editPreferredLastName}
                            label={t('common.last_name')}
                            size="small"
                            variant="filled"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    sx={{ bgcolor: 'info.light', borderRadius: '50%', padding: '0.2rem' }}
                                    aria-label={t('common.edit')}
                                    onClick={() => setEditPreferredLastName(!editPreferredLastName)}>
                                    <EditIcon sx={{ width: '1.2rem', height: '1.2rem' }} />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            error={touched && !!error}
                            helperText={<ErrorMessage name={field.name} />}
                          />
                        )}
                      </Field>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="contained" type="submit">
                          {t('common.save')}
                        </Button>
                      </Box>
                    </InputContainerBox>
                  </Form>
                </Formik>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mt: '0.6rem' }}>{t('common.orcid')}</Typography>
                  <UserOrcid user={user} />
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ gridArea: 'roles', gridRow: 2 }}>
            <UserRoles user={user} />
          </Box>
        </BackgroundDiv>
        <Box sx={{ gridArea: 'research-profile' }}>
          <ResearchProfilePanel person={person} isLoadingPerson={isLoadingPerson} />
        </Box>
      </Box>
    </>
  );
};
