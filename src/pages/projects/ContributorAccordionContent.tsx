import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ProjectContributor } from '../../types/project.types';
import { getLanguageString } from '../../utils/translation-helpers';

const StyledContributorElement = styled.div`
  margin-bottom: 0.5rem;
`;

interface ContributorAccordionContentProps {
  contributors: ProjectContributor[];
}

export const ContributorAccordionContent = ({ contributors }: ContributorAccordionContentProps) => {
  const { t } = useTranslation('project');

  const projectManagers = contributors.filter((contributor) => contributor.type === 'ProjectManager');
  const projectParticipants = contributors.filter((contributor) => contributor.type === 'ProjectParticipant');

  return (
    <>
      {projectManagers.length > 0 && (
        <>
          <Typography variant="overline" component="h3">
            {t('project_manager')}
          </Typography>
          {projectManagers.map((manager) => (
            <ContributorElement key={manager.identity.id} contributor={manager} />
          ))}
        </>
      )}
      {projectParticipants.length > 0 && (
        <>
          <Typography variant="overline" component="h3">
            {t('project_participants')}
          </Typography>
          {projectParticipants.map((participant) => (
            <ContributorElement key={participant.identity.id} contributor={participant} />
          ))}
        </>
      )}
    </>
  );
};

interface ContributorElementProps {
  contributor: ProjectContributor;
}

const ContributorElement = ({ contributor }: ContributorElementProps) => {
  return (
    <StyledContributorElement>
      <Typography variant="subtitle2" component="p">
        {contributor.identity.firstName} {contributor.identity.lastName}
      </Typography>
      <Typography variant="body2">{getLanguageString(contributor.affiliation.name)}</Typography>
    </StyledContributorElement>
  );
};
