import { Box, BoxProps, styled, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { getInitials } from '../../../utils/general-helpers';

export const StyledBaseContributorIndicator = ({ sx, ...props }: BoxProps) => {
  const { t } = useTranslation();
  return (
    <Box
      role="img"
      aria-label={t('common.initials')}
      sx={{
        width: '1.75rem',
        height: '1.75rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        ...sx,
      }}
      {...props}
    />
  );
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
  contributorName: string;
  contributorId?: string;
  hasVerifiedAffiliation: boolean;
}

export const ContributorIndicator = ({
  contributorName,
  contributorId,
  hasVerifiedAffiliation,
}: ContributorIndicatorProps) => {
  const { t } = useTranslation();
  const initials = getInitials(contributorName);
  const hasId = !!contributorId;
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
