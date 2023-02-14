import { useState } from 'react';
import { ListItem, Typography, Link as MuiLink, Box, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { getProjectPath, getResearchProfilePath } from '../../../utils/urlPaths';
import { CristinProject } from '../../../types/project.types';
import {
  getProjectManagers,
  getProjectParticipants,
} from '../../registration/description_tab/projects_field/projectHelpers';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { ProjectFormDialog } from '../../projects/form/ProjectFormDialog';
import { BetaFunctionality } from '../../../components/BetaFunctionality';

interface ProjectListItemProps {
  project: CristinProject;
  showEdit?: boolean;
}

export const ProjectListItem = ({ project, showEdit = false }: ProjectListItemProps) => {
  const { t } = useTranslation();
  const [openEditProject, setOpenEditProject] = useState(false);

  const projectManagers = getProjectManagers(project.contributors);
  const projectParticipantsLength = getProjectParticipants(project.contributors).length;

  return (
    <ListItem
      sx={{
        border: '2px solid',
        borderColor: 'secondary.dark',
        borderLeft: '1.25rem solid',
        borderLeftColor: 'project.main',
        flexDirection: 'column',
        alignItems: 'start',
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: '600' }} gutterBottom>
          <MuiLink component={Link} to={getProjectPath(project.id)}>
            {project.title}
          </MuiLink>
        </Typography>
        <BetaFunctionality>
          {showEdit && (
            <Tooltip title={t('project.edit_project')}>
              <IconButton onClick={() => setOpenEditProject(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <ProjectFormDialog
            open={openEditProject}
            currentProject={project}
            onClose={() => setOpenEditProject(false)}
          />
        </BetaFunctionality>
      </Box>
      <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', mb: '1rem' }}>
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
      <AffiliationHierarchy unitUri={project.coordinatingInstitution.id} />
    </ListItem>
  );
};
