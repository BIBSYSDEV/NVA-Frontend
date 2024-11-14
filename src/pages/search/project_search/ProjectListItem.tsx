import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Link as MuiLink, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { CristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getEditProjectPath, getProjectPath, getResearchProfilePath } from '../../../utils/urlPaths';
import { getFullName } from '../../../utils/user-helpers';
import { EditIconButton } from '../../messages/components/EditIconButton';
import { ProjectIconHeader } from '../../project/components/ProjectIconHeader';
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

export const ProjectListItem = ({ project, showEdit = false, onDelete, deleteTooltip }: ProjectListItemProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const projectManagers = getProjectManagers(project.contributors);
  const projectParticipantsLength = getProjectParticipants(project.contributors).length;

  return (
    <SearchListItem sx={{ borderLeftColor: 'project.main', flexDirection: 'row' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
        <ProjectIconHeader projectStatus={project.status} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: '600' }} gutterBottom>
            <MuiLink component={Link} to={getProjectPath(project.id)}>
              {project.title}
            </MuiLink>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', mb: '0.5rem' }}>
          {projectManagers.map((projectManager, index) =>
            projectManager.identity.id ? (
              <span key={projectManager.identity.id}>
                <MuiLink component={Link} to={getResearchProfilePath(projectManager.identity.id)}>
                  {getFullName(projectManager.identity.firstName, projectManager.identity.lastName)}
                </MuiLink>
                {index < projectManagers.length - 1 && <span>;</span>}
              </span>
            ) : (
              <span key={`${projectManager.identity.firstName}_${projectManager.identity.lastName}_${index}`}>
                {`${projectManager.identity.firstName} ${projectManager.identity.lastName}`}
              </span>
            )
          )}
          {projectParticipantsLength > 0 && (
            <Typography>({t('search.additional_participants', { count: projectParticipantsLength })})</Typography>
          )}
        </Box>
        <Typography>{getLanguageString(project.coordinatingInstitution.labels)}</Typography>
      </Box>
      <>
        {showEdit && (
          <EditIconButton
            tooltip={t('project.edit_project')}
            onClick={() => history.push(getEditProjectPath(project.id))}
          />
        )}
        {onDelete && (
          <Tooltip title={deleteTooltip}>
            <IconButton
              sx={{ alignSelf: 'start' }}
              onClick={onDelete}
              data-testid={dataTestId.registrationWizard.resourceType.removeRelationButton(project.id)}>
              <CloseIcon sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: '50%', p: '0.25rem' }} />
            </IconButton>
          </Tooltip>
        )}
      </>
    </SearchListItem>
  );
};
