import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, IconButton, Link, Tooltip, Typography } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import OrcidLogo from '../../resources/images/orcid_logo.svg';
import { Contributor } from '../../types/contributor.types';
import { getDistinctContributorUnits } from '../../utils/institutions-helpers';
import { dataTestId } from '../../utils/dataTestIds';
import { contributorConfig, groupContributors } from '../../utils/registration-helpers';
import { getResearchProfilePath } from '../../utils/urlPaths';
import { PublicationInstanceType } from '../../types/registration.types';

interface PublicRegistrationContributorsProps {
  contributors: Contributor[];
  registrationType: PublicationInstanceType;
}

export const PublicRegistrationContributors = ({
  contributors,
  registrationType,
}: PublicRegistrationContributorsProps) => {
  const { t } = useTranslation();
  const { primaryContributors, secondaryContributors } = groupContributors(contributors, registrationType);

  const [showAll, setShowAll] = useState(primaryContributors.length === 0);
  const toggleShowAll = () => setShowAll(!showAll);

  const primaryContributorsToShow = showAll ? primaryContributors : primaryContributors.slice(0, 10);
  const { primaryRoles, secondaryRoles } = contributorConfig[registrationType];
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
            showRole={primaryRoles.length > 1}
          />
          {showAll && secondaryContributorsToShow.length > 0 && (
            <ContributorsRow
              contributors={secondaryContributorsToShow}
              distinctUnits={distinctUnits}
              showRole={secondaryRoles.length > 1}
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
  showRole?: boolean;
  hiddenCount?: number;
}

const ContributorsRow = ({
  contributors,
  distinctUnits,
  label,
  showRole = false,
  hiddenCount,
}: ContributorsRowProps) => {
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
            identity: { id, name, orcId },
          } = contributor;
          const affiliationIndexes = contributor.affiliations
            ?.map((affiliation) => affiliation.id && distinctUnits.indexOf(affiliation.id) + 1)
            .filter((affiliationIndex) => affiliationIndex)
            .sort();

          return (
            <Typography key={index} component="li">
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
              {showRole && ` (${t(`registration.contributors.types.${contributor.role}`)})`}
              {(orcId || (affiliationIndexes && affiliationIndexes.length > 0)) && (
                <sup>
                  {affiliationIndexes && affiliationIndexes.length > 0 && affiliationIndexes.join(',')}
                  {orcId && (
                    <Tooltip title={t('common.orcid_profile')}>
                      <IconButton size="small" href={orcId} target="_blank">
                        <img src={OrcidLogo} height="20" alt="orcid" />
                      </IconButton>
                    </Tooltip>
                  )}
                </sup>
              )}
            </Typography>
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
