import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProjectContributor } from '../../types/project.types';
import { getLanguageString } from '../../utils/translation-helpers';
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
              <Typography variant="h3">{t('project.project_manager')}</Typography>
              <ContributorList contributors={projectManagers} />
            </div>
          )}
          {projectParticipants.length > 0 && (
            <div>
              <Typography variant="h3">{t('project.project_participants')}</Typography>
              <ContributorList contributors={projectParticipants} />
            </div>
          )}
        </>
      )}
    </Box>
  );
};

interface ContributorListProps {
  contributors: ProjectContributor[];
}

const ContributorList = ({ contributors }: ContributorListProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
      gap: '0.75rem',
    }}>
    {contributors.map((contributor, index) => (
      <div key={index}>
        <Typography variant="subtitle1" component="p">
          {contributor.identity.firstName} {contributor.identity.lastName}
        </Typography>
        <Typography variant="body2">{getLanguageString(contributor.affiliation?.labels)}</Typography>
      </div>
    ))}
  </Box>
);
