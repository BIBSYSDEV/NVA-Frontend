import { MenuItem, Checkbox, Typography, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { NviSearchStatus, NviSearchStatusEnum } from '../../../types/nvi.types';
import { computeDropdownStatusFromParams, computeParamsFromDropdownStatus } from '../nviUtils';

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

/* NOTE: This filter influences which options are available in NviVisibilityFilter */
export const NviStatusFilter = () => {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const { status, globalStatus } = useNviCandidatesParams();
  const selectedOptions = computeDropdownStatusFromParams(status, globalStatus);

  const handleChange = (event: SelectChangeEvent<NviSearchStatus[]>) => {
    const selectedValues = event.target.value as NviSearchStatus[];
    setSearchParams((params) => {
      const syncedParams = syncParamsWithSearchFields(params);
      syncedParams.delete(NviCandidatesSearchParam.Filter);
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
