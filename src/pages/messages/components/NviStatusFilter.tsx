import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { NviCandidateSearchStatus } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export const NviStatusFilter = (props: TextFieldProps) => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { filter } = useNviCandidatesParams();

  return (
    <TextField
      {...props}
      data-testid={dataTestId.tasksPage.nvi.statusFilter}
      select
      size="small"
      label={t('common.status')}
      value={filter ?? ''}
      onChange={(event) => {
        const newStatus = event.target.value;
        setSearchParams((prevParams) => {
          const syncedParams = syncParamsWithSearchFields(prevParams);
          if (newStatus) {
            syncedParams.set(NviCandidatesSearchParam.Filter, newStatus);
          } else {
            syncedParams.delete(NviCandidatesSearchParam.Filter);
          }
          if (newStatus === 'pending') {
            syncedParams.delete(NviCandidatesSearchParam.Assignee);
          }
          syncedParams.delete(NviCandidatesSearchParam.Visibility);
          return syncedParams;
        });
      }}>
      <MenuItem value={'pending' satisfies NviCandidateSearchStatus}>{t('tasks.nvi.status.New')}</MenuItem>
      <MenuItem value={'assigned' satisfies NviCandidateSearchStatus}>{t('tasks.nvi.status.Pending')}</MenuItem>
      <MenuItem value={'approved' satisfies NviCandidateSearchStatus}>{t('tasks.nvi.status.Approved')}</MenuItem>
      <MenuItem value={'rejected' satisfies NviCandidateSearchStatus}>{t('tasks.nvi.status.Rejected')}</MenuItem>
      <MenuItem value={'dispute' satisfies NviCandidateSearchStatus}>{t('tasks.nvi.status.Dispute')}</MenuItem>
    </TextField>
  );
};

export const NviAvailabilityFilter = (props: TextFieldProps) => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { filter, visibility } = useNviCandidatesParams();

  return (
    <TextField
      {...props}
      data-testid={dataTestId.tasksPage.nvi.availabilityFilter}
      select
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
      size="small"
      label={t('tasks.display_options')}
      value={visibility ?? ''}
      onChange={(event) => {
        const newVisibility = event.target.value;
        setSearchParams((prevParams) => {
          const syncedParams = syncParamsWithSearchFields(prevParams);
          if (newVisibility) {
            syncedParams.set(NviCandidatesSearchParam.Visibility, newVisibility);
          } else {
            syncedParams.delete(NviCandidatesSearchParam.Visibility);
          }
          return syncedParams;
        });
      }}>
      <MenuItem value="">{t('common.show_all')}</MenuItem>
      {filter === 'pending' && (
        <MenuItem value={'pendingCollaboration' satisfies NviCandidateSearchStatus}>
          {t('tasks.nvi.waiting_for_your_institution')}
        </MenuItem>
      )}
      {filter === 'assigned' && (
        <MenuItem value={'assignedCollaboration' satisfies NviCandidateSearchStatus}>
          {t('tasks.nvi.waiting_for_your_institution')}
        </MenuItem>
      )}
      {filter === 'approved' && (
        <MenuItem value={'approvedCollaboration' satisfies NviCandidateSearchStatus}>
          {t('tasks.nvi.waiting_for_other_institutions')}
        </MenuItem>
      )}
      {filter === 'rejected' && (
        <MenuItem value={'rejectedCollaboration' satisfies NviCandidateSearchStatus}>
          {t('tasks.nvi.waiting_for_other_institutions')}
        </MenuItem>
      )}
    </TextField>
  );
};
