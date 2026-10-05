import { Box, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { CorrectionListId } from '../../../types/nvi.types';
import { setPublicationYearParams } from '../../../utils/correctionListHelpers';
import { dataTestId } from '../../../utils/dataTestIds';
import { getDefaultNviYear, getSelectableYears } from '../../../utils/nviHelpers';
import { resetPagination } from '../../../utils/searchHelpers';

// The correction lists are NVI work, so the years offered follow the NVI year rather than the
// calendar year. The two differ before May, while the previous year is still being reported
const defaultNviYear = getDefaultNviYear();
const standardYears = [defaultNviYear + 1, defaultNviYear, defaultNviYear - 1];

/** The value the select uses when no year is filtered on. */
const showAllValue = 'showAll';

interface CorrectionListYearFilterProps {
  listId: CorrectionListId | null;
  showAllYearsOption: boolean;
}

export const CorrectionListYearFilter = ({ listId, showAllYearsOption }: CorrectionListYearFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const selectedYear = searchParams.get(ResultParam.PublicationYear) ?? showAllValue;

  const yearOptions = getSelectableYears(standardYears, selectedYear).map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const options = showAllYearsOption
    ? [...yearOptions, { value: showAllValue, label: t('common.show_all') }]
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

          if (selectedValue !== showAllValue) {
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
