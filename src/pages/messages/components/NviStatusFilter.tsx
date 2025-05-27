import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export const NviStatusFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { filter } = useNviCandidatesParams();

  return (
    <TextField
      select
      size="small"
      label={t('common.status')}
      sx={{ width: '15rem' }}
      value={filter}
      onChange={(event: any) => {
        const newStatus = event.target.value;
        setSearchParams((prevParams) => {
          const syncedParams = syncParamsWithSearchFields(prevParams);
          if (newStatus) {
            syncedParams.set('filter', newStatus);
          } else {
            syncedParams.delete('filter');
          }
          syncedParams.delete('visibility');
          return syncedParams;
        });
      }}>
      <MenuItem value="pending">{t('tasks.nvi.status.New')}</MenuItem>
      <MenuItem value="assigned">{t('tasks.nvi.status.Pending')}</MenuItem>
      <MenuItem value="approved">{t('tasks.nvi.status.Approved')}</MenuItem>
      <MenuItem value="rejected">{t('tasks.nvi.status.Rejected')}</MenuItem>
      <MenuItem value="dispute">{t('tasks.nvi.status.Dispute')}</MenuItem>
    </TextField>
  );
};

export const NviAvailabilityFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { filter, visibility } = useNviCandidatesParams();

  return (
    <TextField
      select
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
      size="small"
      label={t('tasks.display_options')}
      sx={{ width: '15rem' }}
      value={visibility ?? ''}
      onChange={(event: any) => {
        const newVisibility = event.target.value;
        setSearchParams((prevParams) => {
          const syncedParams = syncParamsWithSearchFields(prevParams);
          if (newVisibility) {
            syncedParams.set('visibility', newVisibility);
          } else {
            syncedParams.delete('visibility');
          }
          return syncedParams;
        });
      }}>
      <MenuItem value="">{t('common.show_all')}</MenuItem>
      {filter === 'pending' && (
        <MenuItem value="pendingCollaboration">{t('tasks.nvi.waiting_for_your_institution')}</MenuItem>
      )}
      {filter === 'assigned' && (
        <MenuItem value="assignedCollaboration">{t('tasks.nvi.waiting_for_your_institution')}</MenuItem>
      )}
      {filter === 'approved' && (
        <MenuItem value="approvedCollaboration">{t('tasks.nvi.waiting_for_other_institutions')}</MenuItem>
      )}
      {filter === 'rejected' && (
        <MenuItem value="rejectedCollaboration">{t('tasks.nvi.waiting_for_other_institutions')}</MenuItem>
      )}
    </TextField>
  );
};
