import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviYearFilterValues } from '../../../utils/nviHelpers';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

const nviYearFilterValues = getNviYearFilterValues(new Date().getFullYear() + 1);

export const NviYearSelector = (props: Pick<TextFieldProps, 'fullWidth'>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { year, offset } = useNviCandidatesParams();

  const searchParams = new URLSearchParams(location.search);

  return (
    <TextField
      select
      data-testid={dataTestId.tasksPage.nvi.yearSelect}
      size="small"
      value={year}
      label={t('search.advanced_search.nvi_reported_year')}
      onChange={(event) => {
        const selectedYear = +event.target.value;
        const syncedParams = syncParamsWithSearchFields(searchParams);
        syncedParams.set(NviCandidatesSearchParam.Year, selectedYear.toString());
        if (offset) {
          syncedParams.delete(NviCandidatesSearchParam.Offset);
        }
        navigate({ search: syncedParams.toString() });
      }}
      sx={{ minWidth: '10rem' }}
      {...props}>
      {nviYearFilterValues.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </TextField>
  );
};
