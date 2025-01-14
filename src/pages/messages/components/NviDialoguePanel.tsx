import { Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NviCandidate } from '../../../types/nvi.types';
import { NviApprovals } from './NviApprovals';
import { NviCandidateActions } from './NviCandidateActions';

interface NviDialoguePanelProps {
  nviCandidate: NviCandidate;
  nviCandidateQueryKey: string[];
}

export const NviDialoguePanel = ({ nviCandidate, nviCandidateQueryKey }: NviDialoguePanelProps) => {
  const { t } = useTranslation();

  const periodStatus = nviCandidate?.period.status;

  return (
    <>
      <Typography variant="h3" component="h2" sx={{ m: '1rem' }}>
        {t('common.nvi_short')}
      </Typography>

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
