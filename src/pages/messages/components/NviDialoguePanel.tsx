import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NviStatusChip } from '../../../components/StatusChip';
import { RootState } from '../../../redux/store';
import { NviCandidate } from '../../../types/nvi.types';
import { hasUnidentifiedContributorProblem } from '../../../utils/nviHelpers';
import { NviApprovals } from './NviApprovals';
import { NviCandidateActions } from './NviCandidateActions';
import { NviDialoguePanelSkeleton } from './NviDialogPanelSkeleton';

interface NviDialoguePanelProps {
  nviCandidate: NviCandidate;
  nviCandidateQueryKey: string[];
  isUpdatingNviCandidateInfo?: boolean;
}

export const NviDialoguePanel = ({
  nviCandidate,
  nviCandidateQueryKey,
  isUpdatingNviCandidateInfo = false,
}: NviDialoguePanelProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const candidateStatus = nviCandidate.approvals.find(
    (approval) => approval.institutionId === user?.topOrgCristinId
  )?.status;
  const periodStatus = nviCandidate.period.status;

  const isPendingCandidate = candidateStatus === 'New' || candidateStatus === 'Pending';
  const hasProblem = hasUnidentifiedContributorProblem(nviCandidate.problems);

  const periodBannerKey =
    periodStatus === 'ClosedPeriod'
      ? 'tasks.nvi.reporting_period_closed'
      : periodStatus === 'NoPeriod'
        ? 'tasks.nvi.reporting_period_missing'
        : null;

  return (
    <>
      <Box
        sx={{
          m: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
        }}>
        <Typography variant="h3" component="h2">
          {t('common.nvi_short')}
        </Typography>
        {isUpdatingNviCandidateInfo ? (
          <Skeleton width={100} height={40} />
        ) : (
          candidateStatus && <NviStatusChip status={candidateStatus} />
        )}
      </Box>
      {!isUpdatingNviCandidateInfo ? (
        <>
          {periodBannerKey && (
            <Typography sx={{ mx: '1rem', mb: '1rem', p: '1rem', bgcolor: 'nvi.main' }}>
              {t(periodBannerKey)}
            </Typography>
          )}
          <Box
            sx={{
              mx: '1rem',
              display: 'grid',
              gap: '1rem',
              gridTemplateAreas: isPendingCandidate
                ? hasProblem
                  ? "'curator' 'approvals' 'divider0' 'problem' 'divider1' 'actions' 'divider2' 'comment'"
                  : "'curator' 'approvals' 'divider1' 'actions' 'divider2' 'comment'"
                : hasProblem
                  ? "'curator' 'approvals' 'divider0' 'problem' 'divider1' 'comment' 'divider2' 'actions'"
                  : "'curator' 'approvals' 'divider1' 'comment' 'divider2' 'actions'",
            }}>
            <NviCandidateActions nviCandidate={nviCandidate} nviCandidateQueryKey={nviCandidateQueryKey} />
            <NviApprovals approvals={nviCandidate?.approvals ?? []} />
          </Box>
        </>
      ) : (
        <NviDialoguePanelSkeleton />
      )}
    </>
  );
};
