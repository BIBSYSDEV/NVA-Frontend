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
import { mainContributorRolesPerType, splitMainContributors } from '../../utils/registration-helpers';
import { getUserPath } from '../../utils/urlPaths';

interface PublicRegistrationContributorsProps {
  contributors: Contributor[];
  registrationType: string;
}

export const PublicRegistrationContributors = ({
  contributors,
  registrationType,
}: PublicRegistrationContributorsProps) => {
  const { t } = useTranslation('registration');
  const [mainContributors, otherContributors] = splitMainContributors(contributors, registrationType);

  const [showAll, setShowAll] = useState(mainContributors.length === 0);
  const toggleShowAll = () => setShowAll(!showAll);

  const mainContributorsToShow = showAll ? mainContributors : mainContributors.slice(0, 10);
  const mainRoles = mainContributorRolesPerType[registrationType];
  const showRolesForMainContributors = mainRoles && mainRoles.length > 1;
  const otherContributorsToShow = showAll ? otherContributors : [];

  const hiddenContributorsCount = useRef(contributors.length - mainContributorsToShow.length);
  const distinctUnits = getDistinctContributorUnits([...mainContributorsToShow, ...otherContributorsToShow]);

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
        <div>
          <ContributorsRow
            contributors={mainContributorsToShow}
            distinctUnits={distinctUnits}
            otherCount={showAll ? undefined : hiddenContributorsCount.current}
            showRole={showRolesForMainContributors}
          />
          {showAll && otherContributorsToShow.length > 0 && (
            <ContributorsRow contributors={otherContributorsToShow} distinctUnits={distinctUnits} isOtherContributors />
          )}
        </div>
        {hiddenContributorsCount.current > 0 && (
          <Button
            startIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={toggleShowAll}
            variant="outlined">
            {showAll ? t('common:show_fewer') : t('common:show_all')}
          </Button>
        )}
      </Box>

      <Box sx={{ mt: '0.5rem', ml: '1rem' }}>
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
  isOtherContributors?: boolean;
  showRole?: boolean;
  otherCount?: number;
}

const ContributorsRow = ({
  contributors,
  distinctUnits,
  isOtherContributors = false,
  showRole = isOtherContributors,
  otherCount,
}: ContributorsRowProps) => {
  const { t } = useTranslation('registration');

  return (
    <Box
      sx={{
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        '> :not(:first-of-type)': {
          ml: '1rem', // Use margin instead of gap to indent wrapped elements
        },
      }}>
      {isOtherContributors && <Typography component="li">{t('heading.contributors')}:</Typography>}
      {contributors.map((contributor, index) => {
        const {
          identity: { id, name, orcId },
        } = contributor;
        const affiliationIndexes = contributor.affiliations
          ?.map((affiliation) => affiliation.id && distinctUnits.indexOf(affiliation.id) + 1)
          .filter((affiliationIndex) => affiliationIndex)
          .sort();
        const encodedId = id ? encodeURIComponent(id) : '';

        return (
          <Typography key={index} component="li">
            {id ? (
              <Link
                component={RouterLink}
                to={getUserPath(encodedId)}
                data-testid={dataTestId.registrationLandingPage.authorLink(encodedId)}>
                {name}
              </Link>
            ) : (
              name
            )}
            {showRole && ` (${t(`contributors.types.${contributor.role}`)})`}
            {(orcId || (affiliationIndexes && affiliationIndexes.length > 0)) && (
              <sup>
                {affiliationIndexes && affiliationIndexes.length > 0 && affiliationIndexes.join(',')}
                {orcId && (
                  <Tooltip title={t<string>('contributors.orcid_profile')}>
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
      {otherCount && otherCount > 0 ? (
        <Typography component="li">{t('public_page.other_contributors', { count: otherCount })}</Typography>
      ) : null}
    </Box>
  );
};
