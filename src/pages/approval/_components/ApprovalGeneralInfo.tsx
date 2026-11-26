import { Link as MuiLink, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledGeneralInfo } from '../../../components/styled/Wrappers';
import { ApprovalDetails, ApprovalEventType, ApprovalRegion, ApprovalView } from '../../../types/approval.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString, toDateStringWithTime } from '../../../utils/date-helpers';
import { getApprovalPeriod, getRegionStatus } from '../_utils/approval-view-helpers';

const regions = [ApprovalRegion.Norway, ApprovalRegion.Eea];

interface ApprovalGeneralInfoProps {
  approvalView: ApprovalView;
  approval?: ApprovalDetails;
}

export const ApprovalGeneralInfo = ({ approvalView, approval }: ApprovalGeneralInfoProps) => {
  const { t } = useTranslation();

  const regionLabel = (label: string, region: ApprovalRegion) => `${label} (${t(region)})`;

  const formatPeriod = (startType: ApprovalEventType, endType: ApprovalEventType, region: ApprovalRegion) => {
    const period = getApprovalPeriod(approvalView.events, startType, endType, region);
    if (!period) {
      return null;
    }
    const start = period.start ? toDateString(period.start) : '';
    const end = period.end ? toDateString(period.end) : '';
    return `${start} - ${end}`.trim();
  };

  const identifiers = approval?.identifiers ?? [];
  const sponsorNames = (approvalView.sponsors ?? []).map((sponsor) => sponsor.name).filter(Boolean);
  const regionStatuses = regions
    .map((region) => ({ region, status: getRegionStatus(approvalView.statuses, region) }))
    .filter(({ status }) => !!status);

  return (
    <StyledGeneralInfo data-testid={dataTestId.approvalLandingPage.generalInfoBox}>
      <dl>
        {regions.map((region) => (
          <InfoItem key={region} label={regionLabel(t('study_period'), region)}>
            {formatPeriod(ApprovalEventType.TrialStart, ApprovalEventType.TrialEnd, region)}
          </InfoItem>
        ))}
        {regions.map((region) => (
          <InfoItem key={region} label={regionLabel(t('recruitment_period'), region)}>
            {formatPeriod(ApprovalEventType.RecruitmentStart, ApprovalEventType.RecruitmentEnd, region)}
          </InfoItem>
        ))}
        <InfoItem label={t('registration.public_page.handle')}>
          {approval?.handle && (
            <MuiLink href={approval.handle} target="_blank" rel="noopener noreferrer">
              {approval.handle}
            </MuiLink>
          )}
        </InfoItem>
      </dl>
      <dl>
        {identifiers.length > 0 ? (
          identifiers.map((identifier) => (
            <InfoItem key={`${identifier.name}-${identifier.value}`} label={identifier.name}>
              {identifier.value}
            </InfoItem>
          ))
        ) : (
          <InfoItem label={t('common.id')}>{approvalView.identifier}</InfoItem>
        )}
        <InfoItem label={t('sponsor')}>{sponsorNames.length > 0 && sponsorNames.join(', ')}</InfoItem>
        <InfoItem label={t('common.status')}>
          {regionStatuses.length > 0 &&
            regionStatuses.map(({ region, status }) => `${t(region)}: ${status}`).join(', ')}
        </InfoItem>
        <InfoItem label={t('last_updated')}>
          {approvalView.modified && toDateStringWithTime(approvalView.modified)}
        </InfoItem>
      </dl>
    </StyledGeneralInfo>
  );
};

interface InfoItemProps {
  label: string;
  children?: ReactNode;
}

/** Shows a label and a value, and "-" when there is no value */
const InfoItem = ({ label, children }: InfoItemProps) => (
  <>
    <Typography variant="overline" component="dt">
      {label}
    </Typography>
    <Typography component="dd">{children || '-'}</Typography>
  </>
);
