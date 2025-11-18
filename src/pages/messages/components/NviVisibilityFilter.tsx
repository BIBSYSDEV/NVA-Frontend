import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { NviCandidateFilter, NviCandidateGlobalStatus, NviCandidatesSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { updateParamsFromStatusAndFilterValues, getVisibilityFilterValue } from '../nviUtils';

/* NOTE: This filter is dependent on the Status filter - whenever a change is made there is influences which options are available here */
export const NviVisibilityFilter = () => {
  const { t } = useTranslation();

  const [, setSearchParams] = useSearchParams();
  const { status, globalStatus, filter } = useNviCandidatesParams();

  const value = getVisibilityFilterValue(status, globalStatus, filter);

  const onlyPendingSelected =
    status?.length === 1 && status[0] === 'pending' && globalStatus?.length === 1 && globalStatus[0] === 'pending';
  const onlyApprovedSelected =
    status?.length === 1 &&
    status[0] === 'approved' &&
    globalStatus &&
    globalStatus.length < 3 &&
    (globalStatus.includes('approved') || globalStatus.includes('pending'));
  const onlyRejectedSelected =
    status?.length === 1 &&
    status[0] === 'rejected' &&
    globalStatus &&
    globalStatus.length < 3 &&
    (globalStatus.includes('rejected') || globalStatus.includes('pending'));
  const onlyDisputeSelected =
    (!status || status.length === 0) && globalStatus?.length === 1 && globalStatus[0] === 'dispute';

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
          return updateParamsFromStatusAndFilterValues(syncedParams, status ?? [], globalStatus ?? [], newFilter);
        });
      }}>
      <MenuItem value="">{t('common.show_all')}</MenuItem>

      {/* We can only show filter values if there is only one value selected in the state-dropdown */}
      {onlyPendingSelected && (
        <MenuItem value={'collaboration' satisfies NviCandidateFilter}>
          {t('tasks.nvi.show_only_collaborative_publications')}
        </MenuItem>
      )}

      {onlyApprovedSelected && (
        <MenuItem value={'pending' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_pending_verification_by_others')}
        </MenuItem>
      )}
      {onlyApprovedSelected && (
        <MenuItem value={'approved' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_approved_by_all')}
        </MenuItem>
      )}

      {onlyRejectedSelected && (
        <MenuItem value={'pending' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_pending_verification_by_others')}
        </MenuItem>
      )}
      {onlyRejectedSelected && (
        <MenuItem value={'rejected' satisfies NviCandidateGlobalStatus}>
          {t('tasks.nvi.candidates_rejected_by_all')}
        </MenuItem>
      )}
      {onlyDisputeSelected && (
        <MenuItem value={'approvedByOthers' satisfies NviCandidateFilter}>
          {t('tasks.nvi.candidates_approved_by_others')}
        </MenuItem>
      )}
      {onlyDisputeSelected && (
        <MenuItem value={'rejectedByOthers' satisfies NviCandidateFilter}>
          {t('tasks.nvi.candidates_rejected_by_others')}
        </MenuItem>
      )}
    </TextField>
  );
};
