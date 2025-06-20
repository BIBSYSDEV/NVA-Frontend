import { MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviYearFilterValues } from '../../../utils/nviHelpers';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

const nviYearFilterValues = getNviYearFilterValues(new Date().getFullYear() + 1);

export const NviYearSelector = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { year, offset } = useNviCandidatesParams();

  const searchParams = new URLSearchParams(location.search);

  return (
    <Select
      data-testid={dataTestId.tasksPage.nvi.yearSelect}
      size="small"
      fullWidth
      inputProps={{ 'aria-label': t('common.year') }}
      value={year}
      onChange={(event) => {
        const selectedYear = event.target.value as number;
        const syncedParams = syncParamsWithSearchFields(searchParams);
        syncedParams.set(NviCandidatesSearchParam.Year, selectedYear.toString());
        if (offset) {
          syncedParams.delete(NviCandidatesSearchParam.Offset);
        }
        navigate({ search: syncedParams.toString() });
      }}>
      {nviYearFilterValues.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </Select>
  );
};
