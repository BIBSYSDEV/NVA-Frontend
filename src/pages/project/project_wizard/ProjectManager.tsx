import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { CristinProject, ProjectFieldName } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { AddProjectContributorModal } from '../../projects/AddProjectContributorModal';
import { ContributorRow } from '../../projects/form/ContributorRow';

interface ProjectContributorsProps {
  suggestedProjectManager?: string;
  isVisited: boolean;
}

export const ProjectManager = ({ suggestedProjectManager, isVisited }: ProjectContributorsProps) => {
  const { t } = useTranslation();
  const [addContributorViewIsOpen, setAddContributorViewIsOpen] = useState(false);
  const { values, errors, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const projectManagerIndex = contributors.findIndex((c) => c.roles.some((r) => r.type === 'ProjectManager'));
  const projectManager = contributors[projectManagerIndex];
  const projectManagerRoleIndex = projectManager?.roles.findIndex((r) => r.type === 'ProjectManager');

  const contributorError = errors?.contributors;

  const removeProjectManager = (name: string, remove: (index: number) => any) => {
    // Project manager has other roles on project: only delete the project manager-role
    if (projectManager.roles.length > 1) {
      const newContributors = [...contributors];
      const newContributorObject = { ...contributors[projectManagerIndex] };
      const newRoles = [...contributors[projectManagerIndex].roles];

      newRoles.splice(projectManagerRoleIndex, 1);
      newContributorObject.roles = newRoles;
      newContributors[projectManagerIndex] = newContributorObject;
      setFieldValue(name, newContributors);
    } else {
      // Project manager is only role: remove contributor
      remove(projectManagerIndex);
    }
  };

  const toggleAddContributorView = () => setAddContributorViewIsOpen(!addContributorViewIsOpen);

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
              sx={{ borderRadius: '1rem', width: '17rem' }}
              onClick={toggleAddContributorView}
              variant="contained"
              startIcon={<AddIcon />}
              disabled={projectManager !== undefined}
              data-testid={dataTestId.projectForm.addProjectManagerButton}>
              {t('project.add_project_manager')}
            </Button>
            {projectManager && (
              <TableContainer sx={{ mb: '0.5rem' }} component={Paper}>
                <Table size="small" sx={alternatingTableRowColor}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.role')}</TableCell>
                      <TableCell>{t('common.name')}</TableCell>
                      <TableCell>{t('common.affiliation')}</TableCell>
                      <TableCell>{t('common.clear')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <ContributorRow
                      key={projectManager.identity.id}
                      contributorIndex={projectManagerIndex}
                      baseFieldName={`${name}[${projectManagerIndex}]`}
                      contributor={projectManager}
                      removeContributor={() => removeProjectManager(name, remove)}
                      isProjectManager
                    />
                  </TableBody>
                </Table>
              </TableContainer>
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
        open={addContributorViewIsOpen}
        toggleModal={toggleAddContributorView}
        addProjectManager
      />
    </>
  );
};
