import {
  MenuItem,
  TextField,
  Checkbox,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
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
import { NviSearchStatus, NviSearchStatusEnum } from '../../../types/nvi.types';
import { computeDropdownStatusFromParams, computeParamsFromDropdownStatus } from '../utils';

const nviStatusOptions = [
  {
    value: NviSearchStatusEnum.CandidatesForControl,
    labelKey: 'tasks.nvi.candidates_for_control',
  },
  {
    value: NviSearchStatusEnum.Approved,
    labelKey: 'tasks.nvi.status.Approved',
  },
  {
    value: NviSearchStatusEnum.Rejected,
    labelKey: 'tasks.nvi.status.Rejected',
  },
] as const;

const labelId = 'nvi-status-filter-select';

export const NviStatusFilter = () => {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const { status, globalStatus } = useNviCandidatesParams();
  const selectedOptions = computeDropdownStatusFromParams(status, globalStatus);

  const handleChange = (event: SelectChangeEvent<NviSearchStatus[]>) => {
    const selectedValues = event.target.value as NviSearchStatus[];
    setSearchParams((params) => {
      const syncedParams = syncParamsWithSearchFields(params);
      const { newStatuses, newGlobalStatuses } = computeParamsFromDropdownStatus(selectedValues);

      if (newStatuses.length === 0) {
        syncedParams.delete(NviCandidatesSearchParam.Status);
      } else {
        syncedParams.set(NviCandidatesSearchParam.Status, newStatuses.join(','));
      }

      if (newGlobalStatuses.length === 0) {
        syncedParams.delete(NviCandidatesSearchParam.GlobalStatus);
      } else {
        syncedParams.set(NviCandidatesSearchParam.GlobalStatus, newGlobalStatuses.join(','));
      }

      return syncedParams;
    });
  };

  return (
    <FormControl size="small" sx={{ width: '100%' }}>
      <InputLabel id={labelId}>{t('common.status')}</InputLabel>
      <Select
        labelId={labelId}
        label={t('common.status')}
        data-testid={dataTestId.tasksPage.nvi.statusFilter}
        multiple
        value={selectedOptions}
        onChange={handleChange}
        renderValue={(selected) => {
          if (selected.length === nviStatusOptions.length) {
            return t('common.show_all');
          } else {
            return selected
              .map((statusValueEnum) => {
                const option = nviStatusOptions.find((opt) => opt.value === statusValueEnum);
                return option ? t(option.labelKey) : statusValueEnum;
              })
              .join(', ');
          }
        }}>
        {nviStatusOptions.map((statusOption) => (
          <MenuItem sx={{ height: '2.5rem' }} key={statusOption.value} value={statusOption.value}>
            <Checkbox checked={selectedOptions.includes(statusOption.value)} />
            <Typography>{t(statusOption.labelKey)}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const getVisibilityFilterValue = (
  status: NviCandidateStatus[] | null,
  globalStatus: NviCandidateGlobalStatus[] | null,
  filter: NviCandidateFilter | null
) => {
  if (status?.includes('pending')) {
    if (filter === 'collaboration') {
      return filter;
    }
  } else if (status?.includes('approved') || status?.includes('rejected')) {
    if (globalStatus?.length === 1) {
      return globalStatus[0];
    }
  } else if (globalStatus?.includes('dispute')) {
    if (filter === 'approvedByOthers' || filter === 'rejectedByOthers') {
      return filter;
    }
  }
  return '';
};

const handleVisibilityFilterChange = (
  params: URLSearchParams,
  status: NviCandidateStatus[] | null,
  globalStatus: NviCandidateGlobalStatus[],
  newFilter: NviCandidateFilter | NviCandidateGlobalStatus
) => {
  if (status?.includes('pending')) {
    if (newFilter === 'collaboration') {
      params.set(NviCandidatesSearchParam.Filter, newFilter satisfies NviCandidateFilter);
    }
  } else if (status?.includes('approved')) {
    if (newFilter === 'approved' || newFilter === 'pending') {
      params.set(NviCandidatesSearchParam.GlobalStatus, newFilter satisfies NviCandidateGlobalStatus);
    } else {
      params.set(
        NviCandidatesSearchParam.GlobalStatus,
        ['approved' satisfies NviCandidateGlobalStatus, 'pending' satisfies NviCandidateGlobalStatus].join(',')
      );
    }
  } else if (status?.includes('rejected')) {
    if (newFilter === 'rejected' || newFilter === 'pending') {
      params.set(NviCandidatesSearchParam.GlobalStatus, newFilter satisfies NviCandidateGlobalStatus);
    } else {
      params.set(
        NviCandidatesSearchParam.GlobalStatus,
        ['rejected' satisfies NviCandidateGlobalStatus, 'pending' satisfies NviCandidateGlobalStatus].join(',')
      );
    }
  } else if (globalStatus?.includes('dispute')) {
    if (newFilter === 'approvedByOthers' || newFilter === 'rejectedByOthers') {
      params.set(NviCandidatesSearchParam.Filter, newFilter satisfies NviCandidateFilter);
    }
  }
  return params;
};

export const NviVisibilityFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { status, globalStatus, filter } = useNviCandidatesParams();

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

      {status?.includes('pending') && (
        <MenuItem value={'collaboration' satisfies NviCandidateFilter}>
          {t('tasks.nvi.show_only_collaborative_publications')}
        </MenuItem>
      )}

      {status?.includes('approved') && (
        <MenuItem value={'pending' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_pending_verification_by_others')}
        </MenuItem>
      )}
      {status?.includes('approved') && (
        <MenuItem value={'approved' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_approved_by_all')}
        </MenuItem>
      )}

      {status?.includes('rejected') && (
        <MenuItem value={'pending' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_pending_verification_by_others')}
        </MenuItem>
      )}
      {status?.includes('rejected') && (
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
