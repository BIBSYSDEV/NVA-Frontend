import { ListItem, ListItemText, Typography, Link as MuiLink, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProjectPath, getResearchProfilePath } from '../../../utils/urlPaths';
import { CristinProject } from '../../../types/project.types';
import {
  getProjectManagers,
  getProjectParticipants,
} from '../../registration/description_tab/projects_field/projectHelpers';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';

interface ProjectListItemProps {
  project: CristinProject;
}

export const ProjectListItem = ({ project }: ProjectListItemProps) => {
  const { t } = useTranslation();
  const projectManagers = getProjectManagers(project.contributors);
  const projectParticipantsLength = getProjectParticipants(project.contributors).length;

  return (
    <ListItem
      sx={{
        border: '2px solid',
        borderLeft: '1.25rem solid',
        borderColor: 'project.main',
        flexDirection: 'column',
        alignItems: 'start',
      }}>
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <ListItemText disableTypography>
          <Typography sx={{ fontSize: '1rem', fontWeight: '600' }}>
            <MuiLink component={Link} to={getProjectPath(project.id)}>
              {project.title}
            </MuiLink>
          </Typography>
        </ListItemText>
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
