import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../api/searchApi';

export const PublicationDateIntervalFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedYearAfter = searchParams.get(ResultParam.PublicationYearAfter);
  const selectedYearBefore = searchParams.get(ResultParam.PublicationYearBefore);

  const selectedYearAfterDate = selectedYearAfter ? new Date(selectedYearAfter) : null;
  const selectedYearBeforeDate = selectedYearBefore ? new Date(selectedYearBefore) : null;

  return (
    <Box sx={{ m: '0.5rem 1rem 1rem 1rem', display: 'flex', justifyContent: 'space-evenly', gap: '1rem' }}>
      <DatePicker
        views={['year']}
        label={t('search.year_from')}
        defaultValue={selectedYearAfter ? new Date(selectedYearAfter) : null}
        maxDate={
          selectedYearBeforeDate ? new Date(selectedYearBeforeDate.getFullYear(), 11, 31, 23, 59, 59, 999) : new Date()
        }
        disableHighlightToday
        slotProps={{ textField: { size: 'small' } }}
        onChange={(date) => {
          if (date) {
            const year = date.getFullYear();
            if (year.toString().length === 4) {
              searchParams.set(ResultParam.PublicationYearAfter, year.toString());
              history.push({ search: searchParams.toString() });
            }
          } else {
            searchParams.delete(ResultParam.PublicationYearAfter);
            history.push({ search: searchParams.toString() });
          }
        }}
      />
      <DatePicker
        views={['year']}
        label={t('search.year_to')}
        defaultValue={selectedYearBefore ? new Date(selectedYearBefore) : null}
        minDate={selectedYearAfterDate}
        maxDate={new Date()}
        disableHighlightToday
        slotProps={{ textField: { size: 'small' } }}
        onChange={(date) => {
          if (date) {
            const year = date.getFullYear();
            if (year.toString().length === 4) {
              searchParams.set(ResultParam.PublicationYearBefore, year.toString());
              history.push({ search: searchParams.toString() });
            }
          } else {
            searchParams.delete(ResultParam.PublicationYearBefore);
            history.push({ search: searchParams.toString() });
          }
        }}
      />
    </Box>
  );
};
