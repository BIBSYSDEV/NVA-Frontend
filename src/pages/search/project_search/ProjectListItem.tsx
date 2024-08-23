import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Link as MuiLink, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ProjectIcon } from '../../../components/ProjectIcon';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { CristinProject } from '../../../types/project.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getProjectPath, getResearchProfilePath } from '../../../utils/urlPaths';
import { ProjectFormDialog } from '../../projects/form/ProjectFormDialog';
import {
  getProjectManagers,
  getProjectParticipants,
} from '../../registration/description_tab/projects_field/projectHelpers';

interface ProjectListItemProps {
  project: CristinProject;
  showEdit?: boolean;
  refetchProjects?: () => void;
}

export const ProjectListItem = ({ project, refetchProjects, showEdit = false }: ProjectListItemProps) => {
  const { t } = useTranslation();
  const [openEditProject, setOpenEditProject] = useState(false);

  const projectManagers = getProjectManagers(project.contributors);
  const projectParticipantsLength = getProjectParticipants(project.contributors).length;

  return (
    <SearchListItem sx={{ borderLeftColor: 'project.main' }}>
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
        {showEdit && (
          <>
            <Tooltip title={t('project.edit_project')}>
              <IconButton
                sx={{ bgcolor: 'project.main', width: '1.5rem', height: '1.5rem' }}
                size="small"
                onClick={() => setOpenEditProject(true)}>
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <ProjectFormDialog
              open={openEditProject}
              currentProject={project}
              onClose={() => setOpenEditProject(false)}
              refetchData={refetchProjects}
            />
          </>
        )}
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
    </SearchListItem>
  );
};
