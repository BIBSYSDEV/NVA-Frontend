import { Box, Link as MuiLink, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { ProjectIcon } from '../../../components/ProjectIcon';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { CristinProject } from '../../../types/project.types';
import { LocalStorageKey } from '../../../utils/constants';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getEditProjectPath, getProjectPath, getResearchProfilePath } from '../../../utils/urlPaths';
import { DeleteIconButton } from '../../messages/components/DeleteIconButton';
import { EditIconButton } from '../../messages/components/EditIconButton';
import { ProjectFormDialog } from '../../projects/form/ProjectFormDialog';
import {
  getProjectManagers,
  getProjectParticipants,
} from '../../registration/description_tab/projects_field/projectHelpers';

interface ProjectListItemProps {
  project: CristinProject;
  showEdit?: boolean;
  refetchProjects?: () => void;
  deleteTooltip?: string;
  onDelete?: () => void;
}

export const ProjectListItem = ({
  project,
  refetchProjects,
  showEdit = false,
  onDelete,
  deleteTooltip,
}: ProjectListItemProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [openEditProject, setOpenEditProject] = useState(false);

  const projectManagers = getProjectManagers(project.contributors);
  const projectParticipantsLength = getProjectParticipants(project.contributors).length;
  const betaEnabled = localStorage.getItem(LocalStorageKey.Beta) === 'true';

  return (
    <SearchListItem sx={{ borderLeftColor: 'project.main', flexDirection: 'row' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', mb: '0.5rem' }}>
          <ProjectIcon />
          <Typography>{t('project.project')}</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>{t(`project.status.${project.status}`).toUpperCase()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: '600' }} gutterBottom>
            <MuiLink component={Link} to={getProjectPath(project.id)}>
              {project.title}
            </MuiLink>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', mb: '0.5rem' }}>
          {projectManagers.map((projectManager, index) => (
            <span key={projectManager.identity.id}>
              <MuiLink component={Link} to={getResearchProfilePath(projectManager.identity.id)}>
                {`${projectManager.identity.firstName} ${projectManager.identity.lastName}`}
              </MuiLink>
              {index < projectManagers.length - 1 && <span>;</span>}
            </span>
          ))}
          {projectParticipantsLength > 0 && (
            <Typography>({t('search.additional_participants', { count: projectParticipantsLength })})</Typography>
          )}
        </Box>
        <Typography>{getLanguageString(project.coordinatingInstitution.labels)}</Typography>
      </Box>
      <>
        {showEdit && (
          <>
            <EditIconButton
              tooltip={t('project.edit_project')}
              onClick={() => (betaEnabled ? history.push(getEditProjectPath(project.id)) : setOpenEditProject(true))}
            />
            <ProjectFormDialog
              open={openEditProject}
              currentProject={project}
              onClose={() => setOpenEditProject(false)}
              refetchData={refetchProjects}
            />
          </>
        )}
        {onDelete && <DeleteIconButton sx={{ ml: '0.5rem' }} onClick={onDelete} tooltip={deleteTooltip} />}
      </>
    </SearchListItem>
  );
};
