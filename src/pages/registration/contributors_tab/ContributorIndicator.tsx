import { styled, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../../types/contributor.types';

const StyledBaseContributorIndicator = styled('div')({
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
});

const StyledVerifiedContributor = styled(StyledBaseContributorIndicator)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledVerifiedContributorWithoutAffiliation = styled(StyledBaseContributorIndicator)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.primary.light,
  color: theme.palette.primary.light,
}));

const StyledUnknownContributor = styled(StyledBaseContributorIndicator)(({ theme }) => ({
  background: theme.palette.grey[400],
  color: theme.palette.grey[500],
}));

interface ContributorIndicatorProps {
  contributor: Contributor;
}

export const ContributorIndicator = ({ contributor }: ContributorIndicatorProps) => {
  const { t } = useTranslation();
  const initials = contributor.identity.name
    .split(' ')
    .slice(0, 2)
    .filter((name) => name.length > 0)
    .map((name) => name[0]);

  const hasId = contributor.identity.id;
  const hasAffiliation = contributor.affiliations && contributor.affiliations.length > 0;

  const verifiedContributor = hasId && hasAffiliation;
  const verifiedContributorWithoutAffiliation = hasId && !hasAffiliation;
  const unknownContributor = !hasId;

  return verifiedContributor ? (
    <Tooltip title={t('registration.contributors.identity_status.confirmed_identity')}>
      <StyledVerifiedContributor>{initials}</StyledVerifiedContributor>
    </Tooltip>
  ) : verifiedContributorWithoutAffiliation ? (
    <Tooltip title={t('registration.contributors.identity_status.confirmed_identity_without_affiliation')}>
      <StyledVerifiedContributorWithoutAffiliation>{initials}</StyledVerifiedContributorWithoutAffiliation>
    </Tooltip>
  ) : unknownContributor ? (
    <Tooltip title={t('registration.contributors.identity_status.unknown_identity')}>
      <StyledUnknownContributor>{initials}</StyledUnknownContributor>
    </Tooltip>
  ) : null;
};
