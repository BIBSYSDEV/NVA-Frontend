import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useRegistrationsQueryParams } from '../../../utils/hooks/useRegistrationSearchParams';
import { getNviYearFilterValues } from '../../../utils/nviHelpers';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

const relevantNviYears = getNviYearFilterValues(new Date().getFullYear() - 1);

export const NviReportedYearFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { scientificReportPeriodSince, scientificIndexStatus } = useRegistrationsQueryParams();

  return (
    <TextField
      data-testid={dataTestId.startPage.advancedSearch.nviReportedYearField}
      select
      disabled={!scientificIndexStatus}
      value={scientificReportPeriodSince ?? ''}
      size="small"
      label={t('search.advanced_search.nvi_reported_year')}
      sx={{ width: '10rem' }}
      onChange={(event) => {
        const selectedYear = event.target.value;
        const syncedParams = syncParamsWithSearchFields(searchParams);
        if (selectedYear) {
          syncedParams.set(ResultParam.ScientificReportPeriodBeforeParam, (+selectedYear + 1).toString());
          syncedParams.set(ResultParam.ScientificReportPeriodSinceParam, selectedYear);
        }
        syncedParams.delete(ResultParam.From);
        navigate({ search: syncedParams.toString() });
      }}>
      {relevantNviYears.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </TextField>
  );
};
