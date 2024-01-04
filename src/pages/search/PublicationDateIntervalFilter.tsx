import { Box } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../api/searchApi';

const commonDatepickerProps: Partial<DatePickerProps<Date | null>> = {
  views: ['year'],
  disableHighlightToday: true,
  slotProps: { textField: { size: 'small' } },
};

export const PublicationDateIntervalFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedYearAfterParam = searchParams.get(ResultParam.PublicationYearAfter);
  const selectedYearBeforeParam = searchParams.get(ResultParam.PublicationYearBefore);

  const selectedYearAfterDate = selectedYearAfterParam ? new Date(selectedYearAfterParam) : null;
  const selectedYearBeforeDate = selectedYearBeforeParam ? new Date(selectedYearBeforeParam) : null;

  const onChangeDate = (
    newDate: Date | null,
    param: ResultParam.PublicationYearAfter | ResultParam.PublicationYearBefore
  ) => {
    if (newDate) {
      const year = newDate.getFullYear();
      if (year.toString().length === 4) {
        searchParams.set(param, year.toString());
        history.push({ search: searchParams.toString() });
      }
    } else {
      searchParams.delete(param);
      history.push({ search: searchParams.toString() });
    }
  };

  const defaultMaxDate = new Date();

  return (
    <Box sx={{ m: '0.5rem 1rem 1rem 1rem', display: 'flex', justifyContent: 'space-evenly', gap: '1rem' }}>
      <DatePicker
        {...commonDatepickerProps}
        label={t('search.year_from')}
        defaultValue={selectedYearAfterDate}
        maxDate={
          selectedYearBeforeDate
            ? new Date(selectedYearBeforeDate.getFullYear(), 11, 31, 23, 59, 59, 999)
            : defaultMaxDate
        }
        onChange={(date) => onChangeDate(date, ResultParam.PublicationYearAfter)}
      />
      <DatePicker
        {...commonDatepickerProps}
        label={t('search.year_to')}
        defaultValue={selectedYearBeforeDate}
        minDate={selectedYearAfterDate}
        maxDate={defaultMaxDate}
        onChange={(date) => onChangeDate(date, ResultParam.PublicationYearBefore)}
      />
    </Box>
  );
};
