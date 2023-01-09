import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { RootState } from '../../../redux/store';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';
import { BackgroundDiv, InputContainerBox } from '../../../components/styled/Wrappers';
import { ResearchProfilePanel } from './ResearchProfilePanel';
import { ErrorMessage, Field, FieldProps, Formik, FormikHelpers, FormikValues } from 'formik';
import EditIcon from '@mui/icons-material/Edit';

export const MyProfile = () => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked
  const firstName = user?.givenName;
  const lastName = user?.familyName;

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
            <Box>
              <Typography>{t('my_page.my_profile.author_name')}</Typography>
              <Formik
                initialValues={{ firstName: firstName, lastName: lastName }}
                onSubmit={function (
                  values: FormikValues,
                  formikHelpers: FormikHelpers<FormikValues>
                ): void | Promise<any> {
                  throw new Error('Function not implemented.');
                }}>
                <InputContainerBox sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Field name={'firstNamePreferred'}>
                    {({ field, meta: { touched, error } }: FieldProps<string>) => (
                      <TextField
                        {...field}
                        id={field.name}
                        value={field.value ?? firstName}
                        required
                        label={t('common.first_name')}
                        size="small"
                        variant="filled"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                sx={{ bgcolor: 'info.light', borderRadius: '50%', padding: '0.2rem' }}
                                aria-label={t('common.edit')}>
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
                  <Field name={'lastNamePreferred'}>
                    {({ field, meta: { touched, error } }: FieldProps<string>) => (
                      <TextField
                        {...field}
                        id={field.name}
                        value={field.value ?? lastName}
                        required
                        label={t('common.last_name')}
                        size="small"
                        variant="filled"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                sx={{ bgcolor: 'info.light', borderRadius: '50%', padding: '0.2rem' }}
                                aria-label={t('common.edit')}>
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
                </InputContainerBox>
              </Formik>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ mt: '0.6rem' }}>{t('common.orcid')}</Typography>
                <UserOrcid user={user} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ gridArea: 'roles', gridRow: 2 }}>
            <UserRoles user={user} />
          </Box>
        </BackgroundDiv>
        <Box sx={{ gridArea: 'research-profile' }}>
          <ResearchProfilePanel />
        </Box>
      </Box>
    </>
  );
};
