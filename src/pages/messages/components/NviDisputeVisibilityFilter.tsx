import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { NviCandidateFilter, NviCandidatesSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviDisputeParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export const NviDisputeVisibilityFilter = () => {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const { filter } = useNviDisputeParams();

  return (
    <TextField
      fullWidth
      data-testid={dataTestId.tasksPage.nvi.disputeVisibilityFilter}
      select
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
      size="small"
      label={t('tasks.display_options')}
      value={filter ?? ''}
      onChange={(event) => {
        const newFilter = event.target.value as NviCandidateFilter;

        setSearchParams((prevParams) => {
          const syncedParams = syncParamsWithSearchFields(prevParams);
          syncedParams.delete(NviCandidatesSearchParam.Filter);
          syncedParams.delete(NviCandidatesSearchParam.Offset);
          if (!!newFilter) {
            syncedParams.set(NviCandidatesSearchParam.Filter, newFilter);
          }
          return syncedParams;
        });
      }}>
      <MenuItem value="">{t('common.show_all')}</MenuItem>
      <MenuItem value={'approvedByOthers' satisfies NviCandidateFilter}>
        {t('tasks.nvi.candidates_approved_by_others')}
      </MenuItem>
      <MenuItem value={'rejectedByOthers' satisfies NviCandidateFilter}>
        {t('tasks.nvi.candidates_rejected_by_others')}
      </MenuItem>
    </TextField>
  );
};
