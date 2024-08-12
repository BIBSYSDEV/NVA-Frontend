import { Box } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/PageHeader';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { SkipLink } from '../../../components/SkipLink';
import { CristinProject, ProjectTab } from '../../../types/project.types';
import { basicProjectValidationSchema } from '../../../utils/validation/project/BasicProjectValidation';
import { InitialProjectFormData } from '../../projects/form/ProjectFormDialog';
import { ProjectConnectionsForm } from './ProjectConnectionsForm';
import { ProjectContributorsForm } from './ProjectContributorsForm';
import { ProjectDescriptionForm } from './ProjectDescriptionForm';
import { ProjectDetailsForm } from './ProjectDetailsForm';
import { ProjectFormStepper } from './ProjectFormStepper';

interface ProjectFormProps {
  project: CristinProject;
}

export const ProjectForm = ({ project }: ProjectFormProps) => {
  const { t } = useTranslation();
  const [tabNumber, setTabNumber] = useState(ProjectTab.Description);
  const [initialValues] = useState<InitialProjectFormData>({ project: project });

  return (
    <>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
      <Formik
        initialValues={initialValues.project!}
        validationSchema={basicProjectValidationSchema}
        onSubmit={() => {}}>
        {() => {
          return (
            <Form noValidate>
              <PageHeader variant="h1">{project.title}</PageHeader>
              <ProjectFormStepper tabNumber={tabNumber} setTabNumber={setTabNumber} />
              <RequiredDescription />
              <Box sx={{ bgcolor: 'secondary.dark', padding: '0' }}>
                <Box id="form" sx={{ bgcolor: 'secondary.main', mb: '2rem', padding: '1.5rem 1.25rem' }}>
                  {tabNumber === ProjectTab.Description && <ProjectDescriptionForm project={project} />}
                  {tabNumber === ProjectTab.Details && <ProjectDetailsForm />}
                  {tabNumber === ProjectTab.Contributors && <ProjectContributorsForm />}
                  {tabNumber === ProjectTab.Connections && <ProjectConnectionsForm />}
                </Box>
                <p>registration form actions</p>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
