import WarningIcon from '@mui/icons-material/Warning';
import { Box, Link, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { ContributorIndicators } from '../../components/ContributorIndicators';
import { Contributor, ContributorRole } from '../../types/contributor.types';
import { dataTestId } from '../../utils/dataTestIds';
import { NviStatusObject } from '../../utils/hooks/useCheckWhichOrgsAreNviInstitutions';
import { getResearchProfilePath } from '../../utils/urlPaths';

interface ContributorItemProps {
  contributor: Contributor;
  distinctUnits: string[];
  orgNviStatuses: Map<string, NviStatusObject>;
  relevantRoles: ContributorRole[];
  showSeparator: boolean;
}

export const ContributorItem = ({
  contributor,
  distinctUnits,
  orgNviStatuses,
  relevantRoles,
  showSeparator,
}: ContributorItemProps) => {
  const { t } = useTranslation();
  const {
    identity: { id, name },
  } = contributor;

  const affiliationIndexes = contributor.affiliations
    ?.map((affiliation) => affiliation.type === 'Organization' && distinctUnits.indexOf(affiliation.id) + 1)
    .filter((affiliationIndex) => affiliationIndex)
    .sort();

  const hasValidRole = !!contributor.role?.type && relevantRoles.includes(contributor.role.type);

  const showRole = relevantRoles.includes(ContributorRole.Creator)
    ? contributor.role?.type !== ContributorRole.Creator
    : true;

  const roleContent = showRole && (
    <Box component="span" sx={{ ml: '0.2rem' }}>
      {hasValidRole ? (
        <>({t(`registration.contributors.types.${contributor.role!.type}`)})</>
      ) : (
        <i>({t('registration.public_page.unknown_role')})</i>
      )}
    </Box>
  );

  /* In an effort to highlight unidentified contributors belonging to an NVI-institution, we are looking up all
   * affiliations of unidentified contributors to check if they are NVI-institutions. */
  const isFetchingOrgNviData =
    !id && contributor.affiliations?.some((a) => a.type === 'Organization' && orgNviStatuses.get(a.id)?.isLoading);

  const hasNviAffiliation = contributor.affiliations?.some(
    (a) => a.type === 'Organization' && orgNviStatuses.get(a.id)?.isNviInstitution === true
  );

  if (isFetchingOrgNviData) {
    return <Skeleton width={120} />;
  }

  return (
    <Box component="li" sx={{ display: 'flex', alignItems: 'end' }}>
      <Typography sx={{ display: 'flex', alignItems: 'center' }}>
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
        {roleContent}
        {affiliationIndexes && affiliationIndexes.length > 0 && (
          <sup style={{ marginLeft: '0.1rem' }}>{affiliationIndexes.join(',')}</sup>
        )}
        {!id && hasNviAffiliation && <WarningIcon fontSize="small" color="warning" />}
      </Typography>
      <ContributorIndicators orcId={contributor.identity.orcId} correspondingAuthor={contributor.correspondingAuthor} />
      {showSeparator && <span>;</span>}
    </Box>
  );
};
