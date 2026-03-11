import { Box, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { dataTestId } from '../../../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

const currentYear = new Date().getFullYear();

const LISTS_EXCLUDING_SHOW_ALL = ['YearBetweenChapterAndBookMismatch'];

export const CorrectionListYearFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const listParam = searchParams.get('list');
  const shouldExcludeShowAll = !!listParam && LISTS_EXCLUDING_SHOW_ALL.includes(listParam);

  const publicationYearParam = searchParams.get(ResultParam.PublicationYear);
  const yearSelectionFromQuery = publicationYearParam ?? 'showAll';

  const selectedYear =
    shouldExcludeShowAll && yearSelectionFromQuery === 'showAll' ? currentYear.toString() : yearSelectionFromQuery;

  const baseOptions = [
    { value: (currentYear + 1).toString(), label: `${currentYear + 1}` },
    { value: currentYear.toString(), label: `${currentYear}` },
    { value: (currentYear - 1).toString(), label: `${currentYear - 1}` },
  ];

  const options = shouldExcludeShowAll
    ? baseOptions
    : [...baseOptions, { value: 'showAll', label: t('common.show_all') }];

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
          const syncedParams = syncParamsWithSearchFields(searchParams);

          if (selectedValue !== 'showAll') {
            syncedParams.set(ResultParam.PublicationYear, selectedValue);
            syncedParams.set(ResultParam.ExcludeParentPublicationYear, selectedValue);
          } else {
            syncedParams.delete(ResultParam.PublicationYear);
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
