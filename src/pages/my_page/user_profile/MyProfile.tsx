import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Divider, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { RootState } from '../../../redux/store';
import { UserInfo } from './UserInfo';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { ResearchProfilePanel } from './ResearchProfilePanel';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';

export const MyProfile = () => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked
  const fullName = `${user?.givenName} ${user?.familyName}`;

  return (
    <>
      <Helmet>
        <title>{t('my_page.my_profile.user_profile')}</title>
      </Helmet>
      <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
        <BackgroundDiv
          sx={{
            display: 'grid',
            columnGap: '3rem',
            gridTemplateAreas: {
              xs: '"primary-info" "roles"',
              md: '"roles" "primary-info"',
            },
            gridTemplateColumns: { xs: '1fr', md: '1fr' },
            gridTemplateRows: { xs: '1fr', md: '1fr 2fr' },
            bgcolor: 'info.light',
          }}>
          <Box>
            <Typography variant="h2">Personalia</Typography>
            <Box sx={{ mt: '3rem', display: 'grid', gridTemplateColumns: '1fr 2fr 3fr', gridColumnEnd: 2 }}>
              <Typography>Forfatternavn</Typography>
              <Formik
                initialValues={{ name: fullName }}
                onSubmit={function (
                  values: FormikValues,
                  formikHelpers: FormikHelpers<FormikValues>
                ): void | Promise<any> {
                  throw new Error('Function not implemented.');
                }}>
                <Form>
                  <Field name="name" type="text" />
                </Form>
              </Formik>
              <UserOrcid user={user} />
            </Box>
          </Box>
          <Box sx={{ gridArea: 'roles', gridRow: 2 }}>
            <UserRoles user={user} />
          </Box>
        </BackgroundDiv>
        <ResearchProfilePanel />
      </Box>
    </>
  );
};
