import { Box } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageHeader } from '../../../components/PageHeader';
import { PageSpinner } from '../../../components/PageSpinner';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { SkipLink } from '../../../components/SkipLink';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { ProjectTab } from '../../../types/project.types';
import { Registration, RegistrationTab } from '../../../types/registration.types';
import { Forbidden } from '../../errorpages/Forbidden';
import { canEditProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectFormStepper } from './ProjectFormStepper';

interface ProjectFormProps {
  projectId: string;
}

export const ProjectForm = ({ projectId }: ProjectFormProps) => {
  const { t } = useTranslation();
  const projectQuery = useFetchProject(projectId);
  const project = projectQuery.data;
  const user = useSelector((store: RootState) => store.user);
  const userCanEditProject = canEditProject(user, project);

  const [tabNumber, setTabNumber] = useState(ProjectTab.Description);

  return projectQuery.isPending ? (
    <PageSpinner aria-label={t('common.result')} />
  ) : !userCanEditProject ? (
    <Forbidden />
  ) : project ? (
    <>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
      <Formik
        initialValues={{ name: 'jared' }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}>
        {({ dirty, values }: FormikProps<Registration>) => (
          <Form noValidate>
            <PageHeader variant="h1">{project.title}</PageHeader>
            <ProjectFormStepper tabNumber={tabNumber} setTabNumber={setTabNumber} />
            <RequiredDescription />
            <BackgroundDiv sx={{ bgcolor: 'secondary.main' }}>
              <Box id="form" mb="2rem">
                {0 === RegistrationTab.Description && (
                  <ErrorBoundary>
                    <p>test 0</p>
                  </ErrorBoundary>
                )}
                {1 === RegistrationTab.ResourceType && (
                  <ErrorBoundary>
                    <p>test 1</p>
                  </ErrorBoundary>
                )}
                {2 === RegistrationTab.Contributors && (
                  <ErrorBoundary>
                    <p>test 2</p>
                  </ErrorBoundary>
                )}
                {3 === RegistrationTab.FilesAndLicenses && <p>test 3</p>}
              </Box>
              <p>registration form actions</p>
            </BackgroundDiv>
          </Form>
        )}
      </Formik>
    </>
  ) : null;
};
