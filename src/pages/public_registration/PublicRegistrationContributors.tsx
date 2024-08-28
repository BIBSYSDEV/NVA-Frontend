import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Link, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ContributorIndicators } from '../../components/ContributorIndicators';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { Contributor, ContributorRole } from '../../types/contributor.types';
import { PublicationInstanceType } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getDistinctContributorUnits } from '../../utils/institutions-helpers';
import { getContributorsWithPrimaryRole, getContributorsWithSecondaryRole } from '../../utils/registration-helpers';
import { getResearchProfilePath } from '../../utils/urlPaths';

interface PublicRegistrationContributorsProps {
  contributors: Contributor[];
  registrationType: PublicationInstanceType;
}

export const PublicRegistrationContributors = ({
  contributors,
  registrationType,
}: PublicRegistrationContributorsProps) => {
  const { t } = useTranslation();
  const primaryContributors = getContributorsWithPrimaryRole(contributors, registrationType);
  const secondaryContributors = getContributorsWithSecondaryRole(contributors, registrationType);

  const [showAll, setShowAll] = useState(primaryContributors.length === 0);
  const toggleShowAll = () => setShowAll(!showAll);

  const primaryContributorsToShow = showAll ? primaryContributors : primaryContributors.slice(0, 10);
  const secondaryContributorsToShow = showAll ? secondaryContributors : [];

  const hiddenContributorsCount = useRef(
    primaryContributors.length + secondaryContributors.length - primaryContributorsToShow.length
  );
  const distinctUnits = getDistinctContributorUnits([...primaryContributorsToShow, ...secondaryContributorsToShow]);

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
          />
          {showAll && secondaryContributorsToShow.length > 0 && (
            <ContributorsRow
              contributors={secondaryContributorsToShow}
              distinctUnits={distinctUnits}
              label={t('registration.heading.contributors')}
            />
          )}
        </Box>
        {hiddenContributorsCount.current > 0 && (
          <Button
            startIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={toggleShowAll}
            variant="outlined">
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
    </Box>
  );
};

interface ContributorsRowProps {
  contributors: Contributor[];
  distinctUnits: string[];
  label?: string;
  hiddenCount?: number;
}

const ContributorsRow = ({ contributors, distinctUnits, label, hiddenCount }: ContributorsRowProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {label && <Typography sx={{ display: 'inline', mr: '0.5rem' }}>{label}:</Typography>}
      <Box
        component="ul"
        sx={{
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          display: 'inline-flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          '> :not(:first-of-type)': {
            ml: '1rem', // Use margin instead of gap to indent wrapped elements
          },
        }}>
        {contributors.map((contributor, index) => {
          const {
            identity: { id, name },
          } = contributor;
          const affiliationIndexes = contributor.affiliations
            ?.map((affiliation) => affiliation.type === 'Organization' && distinctUnits.indexOf(affiliation.id) + 1)
            .filter((affiliationIndex) => affiliationIndex)
            .sort();

          const showRole = contributor.role.type !== ContributorRole.Creator;

          return (
            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'end' }}>
              <Typography>
                {id ? (
                  <Link
                    component={RouterLink}
                    to={getResearchProfilePath(id)}
                    data-testid={dataTestId.registrationLandingPage.authorLink(id)}>
                    {name}
                  </Link>
                ) : (
                  name
                )}
                {showRole && ` (${t(`registration.contributors.types.${contributor.role.type}`)})`}
                {affiliationIndexes && affiliationIndexes.length > 0 && (
                  <sup>{affiliationIndexes && affiliationIndexes.length > 0 && affiliationIndexes.join(',')}</sup>
                )}
              </Typography>
              <ContributorIndicators contributor={contributor} />
              {index < contributors.length - 1 && <span>;</span>}
            </Box>
          );
        })}
        {hiddenCount && hiddenCount > 0 ? (
          <Typography component="li">
            {t('registration.public_page.other_contributors', { count: hiddenCount })}
          </Typography>
        ) : null}
      </Box>
    </div>
  );
};
