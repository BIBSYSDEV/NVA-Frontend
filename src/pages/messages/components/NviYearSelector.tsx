import { MenuItem, Select, SelectProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviYearFilterValues } from '../../../utils/nviHelpers';

const nviYearFilterValues = getNviYearFilterValues();

export const NviYearSelector = (props: Partial<SelectProps>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { year, offset } = useNviCandidatesParams();

  const searchParams = new URLSearchParams(location.search);

  return (
    <Select
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
        navigate({ search: searchParams.toString() });
      }}
      {...props}>
      {nviYearFilterValues.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </Select>
  );
};
