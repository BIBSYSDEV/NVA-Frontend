import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button } from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoBanner } from '../../components/InfoBanner';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { NviCandidateProblemsContext } from '../../context/NviCandidateProblemsContext';
import { Contributor } from '../../types/contributor.types';
import { PublicationInstanceType } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getDistinctContributorUnits } from '../../utils/institutions-helpers';
import { hasUnidentifiedContributorProblem } from '../../utils/nviHelpers';
import { contributorConfig, getContributorsWithPrimaryRole } from '../../utils/registration-helpers';
import { ContributorsRow } from './ContributorRow';

interface PublicRegistrationContributorsProps {
  contributors: Contributor[];
  registrationType: PublicationInstanceType;
}

export const PublicRegistrationContributors = ({
  contributors,
  registrationType,
}: PublicRegistrationContributorsProps) => {
  const { t } = useTranslation();
  const { problems } = useContext(NviCandidateProblemsContext);

  const primaryContributors = getContributorsWithPrimaryRole(contributors, registrationType) as Contributor[];
  const otherContributors = contributors.filter((contributor) => !primaryContributors.includes(contributor));

  const [showAll, setShowAll] = useState(primaryContributors.length === 0);
  const toggleShowAll = () => setShowAll(!showAll);

  const primaryContributorsToShow = showAll ? primaryContributors : primaryContributors.slice(0, 10);
  const secondaryContributorsToShow = showAll ? otherContributors : [];

  const hiddenContributorsCount = useRef(
    primaryContributors.length + otherContributors.length - primaryContributorsToShow.length
  );
  const distinctUnits = getDistinctContributorUnits([...primaryContributorsToShow, ...secondaryContributorsToShow]);

  const relevantRoles = [
    ...contributorConfig[registrationType].primaryRoles,
    ...contributorConfig[registrationType].secondaryRoles,
  ];

  return (
    <Box
      data-testid={dataTestId.registrationLandingPage.contributors}
      sx={{ pb: '1rem', borderBottom: '1px solid', mb: '1rem' }}>
      <Box
        sx={{
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ContributorsRow
            contributors={primaryContributorsToShow}
            distinctUnits={distinctUnits}
            hiddenCount={showAll ? undefined : hiddenContributorsCount.current}
            relevantRoles={relevantRoles}
          />
          {showAll && secondaryContributorsToShow.length > 0 && (
            <ContributorsRow
              contributors={secondaryContributorsToShow}
              distinctUnits={distinctUnits}
              relevantRoles={relevantRoles}
            />
          )}
        </Box>
        {hiddenContributorsCount.current > 0 && (
          <Button
            size="small"
            startIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={toggleShowAll}
            color="tertiary"
            variant="contained">
            {showAll ? t('common.show_fewer') : t('common.show_all')}
          </Button>
        )}
      </Box>

      <Box sx={{ m: '0.5rem 0 0 0', pl: 0 }} component="ul">
        {distinctUnits.map((unitUri, index) => (
          <Box key={unitUri} component="li" sx={{ display: 'flex', gap: '0.25rem' }}>
            <sup>{index + 1}</sup>
            <AffiliationHierarchy key={unitUri} unitUri={unitUri} commaSeparated />
          </Box>
        ))}
      </Box>

      {problems && hasUnidentifiedContributorProblem(problems) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '1rem' }}>
          <InfoBanner size="small" text={t('tasks.nvi.unidentified_person_with_nvi_institution')} />
        </Box>
      )}
    </Box>
  );
};
