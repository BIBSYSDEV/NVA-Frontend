import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NviStatusChip } from '../../../components/StatusChip';
import { RootState } from '../../../redux/store';
import { NviCandidate } from '../../../types/nvi.types';
import { hasUnidentifiedContributorProblem } from '../../../utils/nviHelpers';
import { NviApprovals } from './NviApprovals';
import { NviCandidateActions } from './NviCandidateActions';

interface NviDialoguePanelProps {
  nviCandidate: NviCandidate;
  nviCandidateQueryKey: string[];
}

export const NviDialoguePanel = ({ nviCandidate, nviCandidateQueryKey }: NviDialoguePanelProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const candidateStatus = nviCandidate.approvals.find(
    (approval) => approval.institutionId === user?.topOrgCristinId
  )?.status;
  const periodStatus = nviCandidate?.period.status;

  const isPendingCandidate = candidateStatus === 'New' || candidateStatus === 'Pending';
  const hasProblem = hasUnidentifiedContributorProblem(nviCandidate.problems);

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
        {candidateStatus && <NviStatusChip status={candidateStatus} />}
      </Box>

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
        {periodStatus === 'OpenPeriod' ? (
          <NviCandidateActions nviCandidate={nviCandidate} nviCandidateQueryKey={nviCandidateQueryKey} />
        ) : periodStatus === 'ClosedPeriod' ? (
          <Typography sx={{ p: '1rem', bgcolor: 'nvi.main' }}>{t('tasks.nvi.reporting_period_closed')}</Typography>
        ) : periodStatus === 'NoPeriod' ? (
          <Typography sx={{ p: '1rem', bgcolor: 'nvi.main' }}>{t('tasks.nvi.reporting_period_missing')}</Typography>
        ) : null}

        <NviApprovals approvals={nviCandidate?.approvals ?? []} />
      </Box>
    </>
  );
};
