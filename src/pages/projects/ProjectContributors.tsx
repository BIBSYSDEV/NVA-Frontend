import { Box, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ProjectContributor, ProjectContributorType } from '../../types/project.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { getResearchProfilePath } from '../../utils/urlPaths';
import {
  getProjectManagers,
  getProjectParticipants,
} from '../registration/description_tab/projects_field/projectHelpers';

interface ProjectContributorsProps {
  contributors: ProjectContributor[];
}

export const ProjectContributors = ({ contributors }: ProjectContributorsProps) => {
  const { t } = useTranslation();

  const projectManagers = getProjectManagers(contributors);
  const projectParticipants = getProjectParticipants(contributors);

  return (
    <Box
      sx={{
        '> div:not(:first-of-type)': {
          mt: '1rem',
        },
      }}>
      {contributors.length === 0 ? (
        <Typography>{t('project.no_participants')}</Typography>
      ) : (
        <>
          {projectManagers.length > 0 && (
            <div>
              <Typography variant="h3" gutterBottom>
                {t('project.project_manager')}
              </Typography>
              <ContributorList contributors={projectManagers} projectRole="ProjectManager" />
            </div>
          )}
          {projectParticipants.length > 0 && (
            <div>
              <Typography variant="h3" gutterBottom>
                {t('project.project_participants')}
              </Typography>
              <ContributorList contributors={projectParticipants} projectRole="ProjectParticipant" />
            </div>
          )}
        </>
      )}
    </Box>
  );
};

interface ContributorListProps {
  contributors: ProjectContributor[];
  projectRole: ProjectContributorType;
}

const ContributorList = ({ contributors, projectRole }: ContributorListProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
      gap: '0.75rem',
    }}>
    {contributors.map((contributor, index) => (
      <div key={index}>
        <Typography variant="subtitle1" component="p">
          <MuiLink component={Link} to={getResearchProfilePath(contributor.identity.id)}>
            {contributor.identity.firstName} {contributor.identity.lastName}
          </MuiLink>
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {contributor.roles.map((contributorRole, j) => {
            if (contributorRole.type === projectRole) {
              return (
                <Typography variant="body2" key={j}>
                  {getLanguageString(contributorRole.affiliation.labels)}
                </Typography>
              );
            }
            return null;
          })}
        </Box>
      </div>
    ))}
  </Box>
);
