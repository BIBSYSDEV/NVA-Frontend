import { Box, BoxProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam } from '../../../api/searchApi';

const commonDatepickerProps: Partial<DatePickerProps<Date>> = {
  format: 'dd.MM.yyyy',
  views: ['year', 'month', 'day'],
  disableHighlightToday: true,

  slotProps: {
    textField: { sx: { maxWidth: '10rem' }, size: 'small' },
  },
};

interface TicketDateIntervalFilterProps {
  boxProps?: Pick<BoxProps, 'sx'>;
  datePickerProps?: Partial<DatePickerProps<Date>>;
}

export const TicketDateIntervalFilter = ({ datePickerProps, boxProps }: TicketDateIntervalFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedDatesParam = searchParams.get(TicketSearchParam.CreatedDate);
  const dateArray = selectedDatesParam ? selectedDatesParam.split(',') : [];

  const [firstDate, setFirstDate] = useState<Date | null>(dateArray.length ? new Date(dateArray.shift() || '') : null);
  const [lastDate, setLastDate] = useState<Date | null>(dateArray.length ? new Date(dateArray.pop() || '') : null);

  const onChangeDate = (newDate: Date | null, type: 'from' | 'to') => {
    let firstDateString = firstDate ? firstDate.toISOString().slice(0, 10) : '';
    let lastDateString = lastDate ? lastDate.toISOString().slice(0, 10) : '';

    if (type === 'from') {
      firstDateString = newDate ? newDate.toISOString().slice(0, 10) : '';
      setFirstDate(newDate);
    } else if (type === 'to') {
      lastDateString = newDate ? newDate.toISOString().slice(0, 10) : '';
      setLastDate(newDate);
    }

    const newDateParam = `${firstDateString},${lastDateString}`;
    if (newDateParam !== ',') {
      searchParams.set(TicketSearchParam.CreatedDate, newDateParam);
    } else {
      searchParams.delete(TicketSearchParam.CreatedDate);
    }
    history.push({ search: searchParams.toString() });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: '1rem', ...boxProps?.sx }}>
      <DatePicker
        {...commonDatepickerProps}
        {...datePickerProps}
        label={t('registration.resource_type.date_from')}
        value={firstDate}
        onChange={(date) => onChangeDate(date, 'from')}
      />
      <DatePicker
        {...commonDatepickerProps}
        {...datePickerProps}
        label={t('registration.resource_type.date_to')}
        value={lastDate}
        onChange={(date) => onChangeDate(date, 'to')}
      />
    </Box>
  );
};
