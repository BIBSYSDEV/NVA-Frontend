import { Box, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { CorrectionListId, nviCorrectionListQueryKey } from '../../../types/nvi.types';
import { setPublicationYearParams } from '../../../utils/correctionListHelpers';
import { dataTestId } from '../../../utils/dataTestIds';
import { resetPagination } from '../../../utils/searchHelpers';

const currentYear = new Date().getFullYear();
const standardYears = [currentYear + 1, currentYear, currentYear - 1];

interface CorrectionListYearFilterProps {
  showAllYearsOption: boolean;
}

export const CorrectionListYearFilter = ({ showAllYearsOption }: CorrectionListYearFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const listId = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;

  const selectedYear = searchParams.get(ResultParam.PublicationYear) ?? 'showAll';

  // A url can carry a year outside the standard window, if the user has changed the url manually. Include it so
  // the field shows the year actually being filtered on instead of rendering blank
  const yearFromUrl = Number(selectedYear);
  const years =
    Number.isInteger(yearFromUrl) && yearFromUrl > 0 && !standardYears.includes(yearFromUrl)
      ? [...standardYears, yearFromUrl].sort((first, second) => second - first)
      : standardYears;

  const yearOptions = years.map((year) => ({ value: year.toString(), label: year.toString() }));

  const options = showAllYearsOption
    ? [...yearOptions, { value: 'showAll', label: t('common.show_all') }]
    : yearOptions;

  return (
    <Box>
      <StyledFilterHeading>{t('basic_data.nvi.period_year')}</StyledFilterHeading>
      <TextField
        sx={{ minWidth: '7rem' }}
        select
        data-testid={dataTestId.tasksPage.nvi.yearSelect}
        size="small"
        value={selectedYear}
        onChange={(event) => {
          const selectedValue = event.target.value;
          const syncedParams = resetPagination(searchParams);

          if (selectedValue !== 'showAll') {
            setPublicationYearParams(syncedParams, listId, selectedValue);
          } else {
            syncedParams.delete(ResultParam.PublicationYear);
            syncedParams.delete(ResultParam.ExcludeParentPublicationYear);
          }
          navigate({ search: syncedParams.toString() });
        }}
        slotProps={{
          htmlInput: {
            'aria-label': t('basic_data.nvi.period_year'),
          },
        }}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
