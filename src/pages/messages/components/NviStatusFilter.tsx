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
          syncedParams.delete(NviCandidatesSearchParam.Offset);

          if (newStatus === 'pending') {
            syncedParams.set(NviCandidatesSearchParam.Status, newStatus satisfies NviCandidateStatus);
            syncedParams.set(NviCandidatesSearchParam.GlobalStatus, newStatus satisfies NviCandidateGlobalStatus);
          } else if (newStatus === 'approved') {
            syncedParams.set(NviCandidatesSearchParam.Status, newStatus satisfies NviCandidateStatus);
            syncedParams.set(
              NviCandidatesSearchParam.GlobalStatus,
              ([newStatus, 'pending'] satisfies NviCandidateGlobalStatus[]).join(',')
            );
          } else if (newStatus === 'rejected') {
            syncedParams.set(NviCandidatesSearchParam.Status, newStatus satisfies NviCandidateStatus);
            syncedParams.set(
              NviCandidatesSearchParam.GlobalStatus,
              ([newStatus, 'pending'] satisfies NviCandidateGlobalStatus[]).join(',')
            );
          } else if (newStatus === 'dispute') {
            syncedParams.delete(NviCandidatesSearchParam.Status);
            syncedParams.set(NviCandidatesSearchParam.GlobalStatus, newStatus satisfies NviCandidateGlobalStatus);
          }

          return syncedParams;
        });
      }}>
      <MenuItem value={'pending' satisfies NviCandidateStatus}>{t('tasks.nvi.candidates_for_control')}</MenuItem>
      <MenuItem value={'approved' satisfies NviCandidateStatus}>{t('tasks.nvi.status.Approved')}</MenuItem>
      <MenuItem value={'rejected' satisfies NviCandidateStatus}>{t('tasks.nvi.status.Rejected')}</MenuItem>
      <MenuItem value={'dispute' satisfies NviCandidateGlobalStatus}>{t('tasks.nvi.status.Dispute')}</MenuItem>
    </TextField>
  );
};

const getVisibilityFilterValue = (
  status: NviCandidateStatus | null,
  globalStatus: NviCandidateGlobalStatus[] | null,
  filter: NviCandidateFilter | null
) => {
  if (status === 'pending') {
    if (filter === 'collaboration') {
      return filter;
    }
  } else if (status === 'approved' || status === 'rejected') {
    if (globalStatus?.length === 1) {
      return globalStatus[0];
    }
  } else if (globalStatus?.includes('dispute')) {
    return filter ?? '';
  }
  return '';
};

const handleVisibilityFilterChange = (
  params: URLSearchParams,
  status: NviCandidateStatus | null,
  globalStatus: NviCandidateGlobalStatus[],
  newFilter: NviCandidateFilter | NviCandidateGlobalStatus
) => {
  if (status === 'pending') {
    if (newFilter) {
      params.set(NviCandidatesSearchParam.Filter, newFilter);
    }
  } else if (status === 'approved') {
    if (newFilter === 'approved' || newFilter === 'pending') {
      params.set(NviCandidatesSearchParam.GlobalStatus, newFilter);
    } else {
      params.set(
        NviCandidatesSearchParam.GlobalStatus,
        ['approved' satisfies NviCandidateGlobalStatus, 'pending' satisfies NviCandidateGlobalStatus].join(',')
      );
    }
  } else if (status === 'rejected') {
    if (newFilter === 'rejected' || newFilter === 'pending') {
      params.set(NviCandidatesSearchParam.GlobalStatus, newFilter);
    } else {
      params.set(
        NviCandidatesSearchParam.GlobalStatus,
        ['rejected' satisfies NviCandidateGlobalStatus, 'pending' satisfies NviCandidateGlobalStatus].join(',')
      );
    }
  } else if (globalStatus?.includes('dispute')) {
    if (newFilter) {
      params.set(NviCandidatesSearchParam.Filter, newFilter);
    }
  }
  return params;
};

export const NviVisibilityFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { filter, globalStatus, status } = useNviCandidatesParams();

  const value = getVisibilityFilterValue(status, globalStatus, filter);

  return (
    <TextField
      fullWidth
      data-testid={dataTestId.tasksPage.nvi.visibilityFilter}
      select
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
      size="small"
      label={t('tasks.display_options')}
      value={value}
      onChange={(event) => {
        const newFilter = event.target.value as NviCandidateFilter | NviCandidateGlobalStatus;

        setSearchParams((prevParams) => {
          const syncedParams = syncParamsWithSearchFields(prevParams);
          syncedParams.delete(NviCandidatesSearchParam.Filter);
          syncedParams.delete(NviCandidatesSearchParam.Offset);
          const updatedParams = handleVisibilityFilterChange(syncedParams, status, globalStatus ?? [], newFilter);
          return updatedParams;
        });
      }}>
      <MenuItem value="">{t('common.show_all')}</MenuItem>

      {status === 'pending' && (
        <MenuItem value={'collaboration' satisfies NviCandidateFilter}>
          {t('tasks.nvi.show_only_collaborative_publications')}
        </MenuItem>
      )}

      {status === 'approved' && (
        <MenuItem value={'pending' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_pending_verification_by_others')}
        </MenuItem>
      )}
      {status === 'approved' && (
        <MenuItem value={'approved' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_approved_by_all')}
        </MenuItem>
      )}

      {status === 'rejected' && (
        <MenuItem value={'pending' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_pending_verification_by_others')}
        </MenuItem>
      )}
      {status === 'rejected' && (
        <MenuItem value={'rejected' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_rejected_by_all')}
        </MenuItem>
      )}

      {globalStatus?.includes('dispute') && (
        <MenuItem value={'approvedByOthers' satisfies NviCandidateFilter}>
          {t('tasks.nvi.candidates_approved_by_others')}
        </MenuItem>
      )}
      {globalStatus?.includes('dispute') && (
        <MenuItem value={'rejectedByOthers' satisfies NviCandidateFilter}>
          {t('tasks.nvi.candidates_rejected_by_others')}
        </MenuItem>
      )}
    </TextField>
  );
};
