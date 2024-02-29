import { styled, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../../types/contributor.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getInitials } from '../../../utils/general-helpers';

export const StyledBaseContributorIndicator = styled('div')({
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
});
StyledBaseContributorIndicator.defaultProps = {
  role: 'img',
};

export const StyledVerifiedContributor = styled(StyledBaseContributorIndicator)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledVerifiedContributorWithoutAffiliation = styled(StyledBaseContributorIndicator)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.primary.light,
  color: theme.palette.primary.light,
}));

const StyledUnknownContributor = styled(StyledBaseContributorIndicator)(({ theme }) => ({
  background: theme.palette.secondary.dark,
}));

interface ContributorIndicatorProps {
  contributor: Contributor;
}

export const ContributorIndicator = ({ contributor }: ContributorIndicatorProps) => {
  const { t } = useTranslation();
  const initials = getInitials(contributor.identity.name);

  const hasId = !!contributor.identity.id;
  const hasVerifiedAffiliation =
    !!contributor.affiliations && contributor.affiliations.some((affiliation) => affiliation.type === 'Organization');

  const verifiedContributor = hasId && hasVerifiedAffiliation;
  const verifiedContributorWithoutAffiliation = hasId && !hasVerifiedAffiliation;

  return verifiedContributor ? (
    <Tooltip title={t('registration.contributors.identity_status.confirmed_identity')}>
      <StyledVerifiedContributor data-testid={dataTestId.registrationWizard.contributors.verifiedAuthor(initials)}>
        {initials}
      </StyledVerifiedContributor>
    </Tooltip>
  ) : verifiedContributorWithoutAffiliation ? (
    <Tooltip title={t('registration.contributors.identity_status.confirmed_identity_without_affiliation')}>
      <StyledVerifiedContributorWithoutAffiliation
        data-testid={dataTestId.registrationWizard.contributors.verifiedAuthorNoAffiliation(initials)}>
        {initials}
      </StyledVerifiedContributorWithoutAffiliation>
    </Tooltip>
  ) : (
    <Tooltip title={t('registration.contributors.identity_status.unknown_identity')}>
      <StyledUnknownContributor data-testid={dataTestId.registrationWizard.contributors.unverifiedAuthor(initials)} />
    </Tooltip>
  );
};
