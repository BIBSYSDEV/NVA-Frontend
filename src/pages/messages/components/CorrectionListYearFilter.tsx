import { Box, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { dataTestId } from '../../../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

const currentYear = new Date().getFullYear();

export const CorrectionListYearFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedValue = searchParams.get(ResultParam.PublicationYear) || 'showAll';

  const options = [
    { value: (currentYear + 1).toString(), label: `${currentYear + 1}` },
    { value: currentYear.toString(), label: `${currentYear}` },
    { value: 'showAll', label: t('common.show_all') },
  ];

  return (
    <Box>
      <StyledFilterHeading>{t('basic_data.nvi.period_year')}</StyledFilterHeading>
      <TextField
        sx={{ minWidth: '7rem' }}
        select
        data-testid={dataTestId.tasksPage.nvi.yearSelect}
        size="small"
        value={selectedValue}
        onChange={(event) => {
          const selectedValue = event.target.value;
          const syncedParams = syncParamsWithSearchFields(searchParams);
          if (selectedValue !== 'showAll') {
            syncedParams.set(ResultParam.PublicationYear, selectedValue.toString());
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
        {options.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </TextField>
    </Box>
  );
};
