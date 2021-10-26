import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ProjectContributor } from '../../types/project.types';
import { getLanguageString } from '../../utils/translation-helpers';

const StyledContributorAccordionContent = styled.div`
  > div:not(:first-child) {
    margin-top: 1rem;
  }
`;

const StyledContributorList = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

interface ProjectContributorsProps {
  contributors: ProjectContributor[];
}

export const ProjectContributors = ({ contributors }: ProjectContributorsProps) => {
  const { t } = useTranslation('project');

  const projectManagers = contributors.filter((contributor) => contributor.type === 'ProjectManager');
  const projectParticipants = contributors.filter((contributor) => contributor.type === 'ProjectParticipant');

  return (
    <StyledContributorAccordionContent>
      {projectManagers.length > 0 && (
        <div>
          <Typography variant="overline" component="h3">
            {t('project_manager')}
          </Typography>
          <StyledContributorList>
            {projectManagers.map((manager) => (
              <ContributorElement key={manager.identity.id} contributor={manager} />
            ))}
          </StyledContributorList>
        </div>
      )}
      {projectParticipants.length > 0 && (
        <div>
          <Typography variant="overline" component="h3">
            {t('project_participants')}
          </Typography>
          <StyledContributorList>
            {projectParticipants.map((participant, index) => (
              <ContributorElement key={index} contributor={participant} />
            ))}
          </StyledContributorList>
        </div>
      )}
    </StyledContributorAccordionContent>
  );
};

interface ContributorElementProps {
  contributor: ProjectContributor;
}

const ContributorElement = ({ contributor }: ContributorElementProps) => (
  <div>
    <Typography variant="subtitle2" component="p">
      {contributor.identity.firstName} {contributor.identity.lastName}
    </Typography>
    <Typography variant="body2">{getLanguageString(contributor.affiliation.name)}</Typography>
  </div>
);
