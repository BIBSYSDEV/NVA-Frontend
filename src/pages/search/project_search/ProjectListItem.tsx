import { useState } from 'react';
import { Typography, Link as MuiLink, Box, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { getProjectPath, getResearchProfilePath } from '../../../utils/urlPaths';
import { CristinProject } from '../../../types/project.types';
import {
  getProjectManagers,
  getProjectParticipants,
} from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectFormDialog } from '../../projects/form/ProjectFormDialog';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { getLanguageString } from '../../../utils/translation-helpers';

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: '600' }} gutterBottom>
          <MuiLink component={Link} to={getProjectPath(project.id)}>
            {project.title}
          </MuiLink>
        </Typography>
        {showEdit && (
          <>
            <Tooltip title={t('project.edit_project')}>
              <IconButton onClick={() => setOpenEditProject(true)}>
                <EditIcon />
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
        {projectManagers.map((projectManager) => (
          <MuiLink
            key={projectManager.identity.id}
            component={Link}
            to={getResearchProfilePath(projectManager.identity.id)}>
            {`${projectManager.identity.firstName} ${projectManager.identity.lastName}`}
          </MuiLink>
        ))}
        {projectParticipantsLength > 0 && (
          <Typography>({t('search.additional_participants', { count: projectParticipantsLength })})</Typography>
        )}
      </Box>

      <Typography>{getLanguageString(project.coordinatingInstitution.labels)}</Typography>
    </SearchListItem>
  );
};
