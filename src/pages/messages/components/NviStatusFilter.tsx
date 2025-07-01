import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { NviCandidateFilter, NviCandidateGlobalStatus, NviCandidatesSearchParam } from '../../../api/searchApi';
import { NviCandidateSearchStatus } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export const NviStatusFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { status } = useNviCandidatesParams();

  const toggleValueFromSearchParams = (key: NviCandidatesSearchParam, value: string) => {
    setSearchParams((params) => {
      const syncedParams = syncParamsWithSearchFields(params);
      syncedParams.delete(NviCandidatesSearchParam.Filter);
      syncedParams.delete(NviCandidatesSearchParam.GlobalStatus);
      syncedParams.delete(NviCandidatesSearchParam.Offset);
      syncedParams.set(NviCandidatesSearchParam.Status, value);
      return syncedParams;
    });
  };

  return (
    <TextField
      fullWidth
      data-testid={dataTestId.tasksPage.nvi.statusFilter}
      select
      size="small"
      label={t('common.status')}
      value={status ?? ''}
      onChange={(event) => {
        const newStatus = event.target.value;
        toggleValueFromSearchParams(NviCandidatesSearchParam.Status, newStatus);
      }}>
      <MenuItem value={'pending' satisfies NviCandidateSearchStatus}>{t('tasks.nvi.status.New')}</MenuItem>
      <MenuItem value={'approved' satisfies NviCandidateSearchStatus}>{t('tasks.nvi.status.Approved')}</MenuItem>
      <MenuItem value={'rejected' satisfies NviCandidateSearchStatus}>{t('tasks.nvi.status.Rejected')}</MenuItem>
      <MenuItem value={'disputed' satisfies NviCandidateGlobalStatus}>{t('tasks.nvi.status.Dispute')}</MenuItem>
    </TextField>
  );
};

export const NviAvailabilityFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { filter, globalStatus, status } = useNviCandidatesParams();

  return (
    <TextField
      fullWidth
      data-testid={dataTestId.tasksPage.nvi.availabilityFilter}
      select
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
      size="small"
      label={t('tasks.display_options')}
      value={filter || globalStatus || ''}
      onChange={(event) => {
        const newFilter = event.target.value;

        setSearchParams((prevParams) => {
          const syncedParams = syncParamsWithSearchFields(prevParams);
          syncedParams.delete(NviCandidatesSearchParam.GlobalStatus);
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
        <MenuItem value={'rejectedCollaboration' satisfies NviCandidateSearchStatus}>
          {t('tasks.nvi.waiting_for_other_institutions')}
        </MenuItem>
      )}
    </TextField>
  );
};
