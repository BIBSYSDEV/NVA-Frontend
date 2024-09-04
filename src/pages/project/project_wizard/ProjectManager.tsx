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
import { findProjectManagerIndex } from '../helpers/projectContributorHelpers';
import { deleteProjectManagerRoleFromContributor } from '../helpers/projectRoleHelpers';

interface ProjectContributorsProps {
  suggestedProjectManager?: string;
  isVisited?: boolean;
}

export const ProjectManager = ({ suggestedProjectManager, isVisited = false }: ProjectContributorsProps) => {
  const { t } = useTranslation();
  const [addProjectManagerViewIsOpen, setAddProjectManagerViewIsOpen] = useState(false);
  const { values, errors, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const projectManagerIndex = findProjectManagerIndex(contributors);
  const projectManager = contributors[projectManagerIndex];

  const contributorError = errors?.contributors;

  const removeProjectManager = (name: string, remove: (index: number) => any) => {
    // Project manager has other roles on project: only delete the project manager-role
    if (projectManager.roles.length > 1) {
      const newContributors = deleteProjectManagerRoleFromContributor(contributors);
      setFieldValue(name, newContributors);
    } else {
      // Project manager is only role: remove contributor
      remove(projectManagerIndex);
    }
  };

  const toggleAddProjectManagerView = () => setAddProjectManagerViewIsOpen(!addProjectManagerViewIsOpen);

  return (
    <>
      <Typography variant="h2">{t('project.project_manager')}</Typography>
      {suggestedProjectManager && (
        <Typography sx={{ marginBottom: '1rem' }}>
          {t('project.project_manager_from_nfr', { name: suggestedProjectManager })}
        </Typography>
      )}
      <FieldArray name={ProjectFieldName.Contributors}>
        {({ name, remove }: FieldArrayRenderProps) => (
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
                  key={projectManager.identity.id}
                  contributorIndex={projectManagerIndex}
                  baseFieldName={`${name}[${projectManagerIndex}]`}
                  contributor={projectManager}
                  removeContributor={() => removeProjectManager(name, remove)}
                  asProjectManager
                />
              </ProjectContributorTable>
            )}
            {contributorError && typeof contributorError === 'string' && isVisited && (
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
        addProjectManager
      />
    </>
  );
};
