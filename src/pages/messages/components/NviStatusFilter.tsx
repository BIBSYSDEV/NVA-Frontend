import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import {
  NviCandidateFilter,
  NviCandidateGlobalStatus,
  NviCandidatesSearchParam,
  NviCandidateStatus,
} from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export const NviStatusFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { status, globalStatus } = useNviCandidatesParams();

  return (
    <TextField
      fullWidth
      data-testid={dataTestId.tasksPage.nvi.statusFilter}
      select
      size="small"
      label={t('common.status')}
      value={status || globalStatus || ''}
      onChange={(event) => {
        const newStatus = event.target.value as NviCandidateStatus | NviCandidateGlobalStatus;

        setSearchParams((params) => {
          const syncedParams = syncParamsWithSearchFields(params);
          syncedParams.delete(NviCandidatesSearchParam.Filter);
          syncedParams.delete(NviCandidatesSearchParam.GlobalStatus);
          syncedParams.delete(NviCandidatesSearchParam.Offset);

          if (newStatus === ('disputed' satisfies NviCandidateGlobalStatus)) {
            syncedParams.delete(NviCandidatesSearchParam.Status);
            syncedParams.set(NviCandidatesSearchParam.GlobalStatus, newStatus);
          } else {
            syncedParams.set(NviCandidatesSearchParam.Status, newStatus);
          }

          return syncedParams;
        });
      }}>
      <MenuItem value={'pending' satisfies NviCandidateStatus}>{t('tasks.nvi.status.New')}</MenuItem>
      <MenuItem value={'approved' satisfies NviCandidateStatus}>{t('tasks.nvi.status.Approved')}</MenuItem>
      <MenuItem value={'rejected' satisfies NviCandidateStatus}>{t('tasks.nvi.status.Rejected')}</MenuItem>
      <MenuItem value={'disputed' satisfies NviCandidateGlobalStatus}>{t('tasks.nvi.status.Dispute')}</MenuItem>
    </TextField>
  );
};

export const NviAvailabilityFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { filter, globalStatus, status } = useNviCandidatesParams();

  const value = status ? filter || globalStatus || '' : filter || '';

  return (
    <TextField
      fullWidth
      data-testid={dataTestId.tasksPage.nvi.availabilityFilter}
      select
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
      size="small"
      label={t('tasks.display_options')}
      value={value}
      onChange={(event) => {
        const newFilter = event.target.value;

        setSearchParams((prevParams) => {
          const syncedParams = syncParamsWithSearchFields(prevParams);
          if (status) {
            syncedParams.delete(NviCandidatesSearchParam.GlobalStatus);
          }
          syncedParams.delete(NviCandidatesSearchParam.Filter);
          syncedParams.delete(NviCandidatesSearchParam.Offset);
          if (
            newFilter === ('rejectedByOthers' satisfies NviCandidateFilter) ||
            newFilter === ('approvedByOthers' satisfies NviCandidateFilter) ||
            newFilter === ('collaboration' satisfies NviCandidateFilter)
          ) {
            syncedParams.set(NviCandidatesSearchParam.Filter, newFilter);
          } else if (newFilter === ('pending' satisfies NviCandidateGlobalStatus)) {
            syncedParams.set(NviCandidatesSearchParam.GlobalStatus, newFilter);
          }

          return syncedParams;
        });
      }}>
      <MenuItem value="">{t('common.show_all')}</MenuItem>

      {status === 'pending' && (
        <MenuItem value={'collaboration' satisfies NviCandidateFilter}>Vis kun sampublikasjoner</MenuItem>
      )}

      {status === 'approved' && (
        <MenuItem value={'approvedByOthers' satisfies NviCandidateFilter}>Kandidater alle har godkjent</MenuItem>
      )}
      {status === 'approved' && (
        <MenuItem value={'pending' satisfies NviCandidateGlobalStatus}>Kandidater andre må godkjenne</MenuItem>
      )}

      {status === 'rejected' && (
        <MenuItem value={'rejectedByOthers' satisfies NviCandidateFilter}>Kandidater alle har avvist</MenuItem>
      )}
      {status === 'rejected' && (
        <MenuItem value={'pending' satisfies NviCandidateGlobalStatus}>Kandidater andre må kontrollere</MenuItem>
      )}

      {globalStatus === 'disputed' && (
        <MenuItem value={'approvedByOthers' satisfies NviCandidateFilter}>Kandidater andre har godkjent</MenuItem>
      )}
      {globalStatus === 'disputed' && (
        <MenuItem value={'rejectedByOthers' satisfies NviCandidateFilter}>Kandidater andre har avvist</MenuItem>
      )}
    </TextField>
  );
};
