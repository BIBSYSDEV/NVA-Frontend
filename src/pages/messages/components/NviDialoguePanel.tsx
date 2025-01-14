import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { NviCandidate } from '../../../types/nvi.types';
import { NviStatusChip } from '../../public_registration/action_accordions/AccordionStatusChip';
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

  return (
    <>
      <Box sx={{ m: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3" component="h2">
          {t('common.nvi_short')}
        </Typography>
        {candidateStatus && <NviStatusChip status={candidateStatus} />}
      </Box>

      {periodStatus === 'OpenPeriod' && nviCandidate ? (
        <NviCandidateActions nviCandidate={nviCandidate} nviCandidateQueryKey={nviCandidateQueryKey} />
      ) : periodStatus === 'ClosedPeriod' ? (
        <Typography sx={{ p: '1rem', bgcolor: 'nvi.main' }}>{t('tasks.nvi.reporting_period_closed')}</Typography>
      ) : periodStatus === 'NoPeriod' ? (
        <Typography sx={{ p: '1rem', bgcolor: 'nvi.main' }}>{t('tasks.nvi.reporting_period_missing')}</Typography>
      ) : null}

      <Divider sx={{ mt: 'auto' }} />
      <NviApprovals approvals={nviCandidate?.approvals ?? []} />
    </>
  );
};
