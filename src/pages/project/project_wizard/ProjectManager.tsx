import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { Button, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CristinProject, ProjectFieldName } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { AddProjectContributorModal } from '../../projects/AddProjectContributorModal';
import { ContributorRow } from '../../projects/form/ContributorRow';
import { ProjectContributorTable } from '../../projects/form/ProjectContributorTable';
import { findProjectManagerIndex, removeProjectManager } from '../helpers/projectContributorHelpers';

interface ProjectContributorsProps {
  suggestedProjectManager?: string;
}

export const ProjectManager = ({ suggestedProjectManager }: ProjectContributorsProps) => {
  const { t } = useTranslation();
  const [addProjectManagerViewIsOpen, setAddProjectManagerViewIsOpen] = useState(false);
  const { values, errors, touched, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const projectManagerIndex = findProjectManagerIndex(contributors);
  const projectManager = contributors[projectManagerIndex];

  const contributorError = touched.contributors && errors?.contributors ? errors.contributors : '';

  const toggleAddProjectManagerView = () => setAddProjectManagerViewIsOpen(!addProjectManagerViewIsOpen);

  return (
    <>
      <Typography variant="h2">{t('project.project_manager')}</Typography>
      <FieldArray name={ProjectFieldName.Contributors}>
        {({ name }: FieldArrayRenderProps) => (
          <>
            <Button
              sx={{ borderRadius: '1rem', width: 'fit-content' }}
              onClick={toggleAddProjectManagerView}
              variant="contained"
              startIcon={<AddIcon />}
              disabled={projectManager !== undefined}
              data-testid={dataTestId.projectForm.addProjectManagerButton}>
              {t('project.add_project_manager')}
            </Button>
            {projectManager && (
              <ProjectContributorTable>
                <ContributorRow
                  contributorIndex={projectManagerIndex}
                  baseFieldName={`${name}[${projectManagerIndex}]`}
                  contributor={projectManager}
                  roleType={'ProjectManager'}
                  removeContributor={() => setFieldValue(name, removeProjectManager(contributors))}
                />
              </ProjectContributorTable>
            )}
            {contributorError && typeof contributorError === 'string' && (
              <Typography
                sx={{ color: 'error.main', marginTop: '0.25rem', letterSpacing: '0.03333em', marginBottom: '1rem' }}>
                {contributorError}
              </Typography>
            )}
          </>
        )}
      </FieldArray>
      <AddProjectContributorModal
        open={addProjectManagerViewIsOpen}
        toggleModal={toggleAddProjectManagerView}
        suggestedProjectManager={suggestedProjectManager}
        addProjectManager
      />
    </>
  );
};
