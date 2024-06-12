import { MenuItem, Select, SelectProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviYearFilterValues } from '../../../utils/nviHelpers';

const nviYearFilterValues = getNviYearFilterValues();

export const NviYearSelector = (props: Partial<SelectProps>) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { year, offset } = useNviCandidatesParams();

  const searchParams = new URLSearchParams(history.location.search);

  return (
    <Select
      {...props}
      data-testid={dataTestId.tasksPage.nvi.yearSelect}
      size="small"
      inputProps={{ 'aria-label': t('common.year') }}
      value={year}
      onChange={(event) => {
        const selectedYear = event.target.value as number;
        searchParams.set(NviCandidatesSearchParam.Year, selectedYear.toString());
        if (offset) {
          searchParams.delete(NviCandidatesSearchParam.Offset);
        }
        history.push({ search: searchParams.toString() });
      }}>
      {nviYearFilterValues.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </Select>
  );
};
