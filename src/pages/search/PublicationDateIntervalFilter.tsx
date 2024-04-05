import { Box, BoxProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../api/searchApi';

const commonDatepickerProps: Partial<DatePickerProps<Date>> = {
  views: ['year'],
  disableHighlightToday: true,
  slotProps: { textField: { sx: { maxWidth: '10rem' }, size: 'small' } },
};

interface PublicationDateIntervalFilterProps {
  boxProps?: Pick<BoxProps, 'sx'>;
  datePickerProps?: Partial<DatePickerProps<Date>>;
}

export const PublicationDateIntervalFilter = ({ datePickerProps, boxProps }: PublicationDateIntervalFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedYearSinceParam = searchParams.get(ResultParam.PublicationYearSince);
  const selectedYearBeforeParam = searchParams.get(ResultParam.PublicationYearBefore);

  const selectedYearSinceDate = selectedYearSinceParam ? new Date(selectedYearSinceParam) : undefined;
  const selectedYearBeforeDate = selectedYearBeforeParam ? new Date(selectedYearBeforeParam) : undefined;

  const onChangeDate = (
    newDate: Date | null,
    param: ResultParam.PublicationYearSince | ResultParam.PublicationYearBefore
  ) => {
    if (newDate) {
      const year = newDate.getFullYear();
      if (year.toString().length === 4) {
        searchParams.set(param, year.toString());
        searchParams.delete(ResultParam.From);
        history.push({ search: searchParams.toString() });
      }
    } else {
      searchParams.delete(param);
      searchParams.delete(ResultParam.From);
      history.push({ search: searchParams.toString() });
    }
  };

  const defaultMaxDate = new Date();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: '1rem', ...boxProps?.sx }}>
      <DatePicker
        {...commonDatepickerProps}
        {...datePickerProps}
        label={t('search.year_from')}
        value={selectedYearSinceDate}
        maxDate={
          selectedYearBeforeDate
            ? new Date(selectedYearBeforeDate.getFullYear(), 11, 31, 23, 59, 59, 999)
            : defaultMaxDate
        }
        onChange={(date) => onChangeDate(date, ResultParam.PublicationYearSince)}
      />
      <DatePicker
        {...commonDatepickerProps}
        {...datePickerProps}
        label={t('search.year_to')}
        value={selectedYearBeforeDate}
        minDate={selectedYearSinceDate}
        maxDate={defaultMaxDate}
        onChange={(date) => onChangeDate(date, ResultParam.PublicationYearBefore)}
      />
    </Box>
  );
};
