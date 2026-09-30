import { Box, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { CorrectionListId, nviCorrectionListQueryKey } from '../../../types/nvi.types';
import { setPublicationYearParams } from '../../../utils/correctionListHelpers';
import { dataTestId } from '../../../utils/dataTestIds';
import { getDefaultNviYear } from '../../../utils/nviHelpers';
import { resetPagination } from '../../../utils/searchHelpers';

const currentYear = new Date().getFullYear();
const defaultNviYear = getDefaultNviYear();

interface CorrectionListYearFilterProps {
  showAllYearsOption: boolean;
}

export const CorrectionListYearFilter = ({ showAllYearsOption }: CorrectionListYearFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const listId = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;

  const publicationYearParam = searchParams.get(ResultParam.PublicationYear);
  const yearSelectionFromQuery = publicationYearParam ?? 'showAll';
  const selectedYear =
    !showAllYearsOption && yearSelectionFromQuery === 'showAll' ? defaultNviYear.toString() : yearSelectionFromQuery;

  const baseOptions = [
    { value: (currentYear + 1).toString(), label: `${currentYear + 1}` },
    { value: currentYear.toString(), label: `${currentYear}` },
    { value: (currentYear - 1).toString(), label: `${currentYear - 1}` },
  ];

  const options = showAllYearsOption
    ? [...baseOptions, { value: 'showAll', label: t('common.show_all') }]
    : baseOptions;

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
