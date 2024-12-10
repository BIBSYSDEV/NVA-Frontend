import { MenuItem, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { useRegistrationsQueryParams } from '../../../utils/hooks/useRegistrationSearchParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export const NviReportedYearFilter = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const { scientificReportPeriodSince, scientificIndexStatus } = useRegistrationsQueryParams();

  return (
    <TextField
      select
      disabled={!scientificIndexStatus}
      value={scientificReportPeriodSince}
      size="small"
      label="Rapporteringsår"
      sx={{ width: '10rem' }}
      onChange={(event) => {
        const selectedYear = event.target.value;
        const syncedParams = syncParamsWithSearchFields(searchParams);
        if (selectedYear) {
          syncedParams.set(ResultParam.ScientificReportPeriodBeforeParam, (+selectedYear + 1).toString());
          syncedParams.set(ResultParam.ScientificReportPeriodSinceParam, selectedYear);
        }
        syncedParams.delete(ResultParam.From);
        history.push({ search: syncedParams.toString() });
      }}>
      <MenuItem value={2022}>2022</MenuItem>
      <MenuItem value={2021}>2021</MenuItem>
      <MenuItem value={2020}>2020</MenuItem>
    </TextField>
  );
};
