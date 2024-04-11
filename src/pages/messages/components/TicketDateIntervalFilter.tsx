import { Box, BoxProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam } from '../../../api/searchApi';

const commonDatepickerProps: Partial<DatePickerProps<Date>> = {
  views: ['day'],
  disableHighlightToday: true,

  slotProps: { textField: { sx: { maxWidth: '10rem' }, size: 'small' } },
};

interface TicketDateIntervalFilterProps {
  boxProps?: Pick<BoxProps, 'sx'>;
  datePickerProps?: Partial<DatePickerProps<Date>>;
}

export const TicketDateIntervalFilter = ({ datePickerProps, boxProps }: TicketDateIntervalFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedDateSinceParam = searchParams.get(TicketSearchParam.FromDate);
  const selectedDateBeforeParam = searchParams.get(TicketSearchParam.ToDate);

  const selectedDateSinceDate = selectedDateSinceParam ? new Date(selectedDateSinceParam) : undefined;
  const selectedDateBeforeDate = selectedDateBeforeParam ? new Date(selectedDateBeforeParam) : undefined;

  const onChangeDate = (newDate: Date | null, param: TicketSearchParam.FromDate | TicketSearchParam.ToDate) => {
    if (newDate) {
      const date = newDate.toISOString().slice(0, 10); // date formatted as 'yyyy-mm-dd'
      searchParams.set(param, date);
      history.push({ search: searchParams.toString() });
    } else {
      searchParams.delete(param);
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
        value={selectedDateSinceDate}
        maxDate={
          selectedDateBeforeDate
            ? new Date(selectedDateBeforeDate.getFullYear(), 11, 31, 23, 59, 59, 999)
            : defaultMaxDate
        }
        onChange={(date) => onChangeDate(date, TicketSearchParam.FromDate)}
      />
      <DatePicker
        {...commonDatepickerProps}
        {...datePickerProps}
        label={t('search.year_to')}
        value={selectedDateBeforeDate}
        minDate={selectedDateSinceDate}
        maxDate={defaultMaxDate}
        onChange={(date) => onChangeDate(date, TicketSearchParam.ToDate)}
      />
    </Box>
  );
};
