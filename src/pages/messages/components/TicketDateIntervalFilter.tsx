import { Box } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { formatDateStringToISO } from '../../../utils/date-helpers';

const commonDatepickerProps: Partial<DatePickerProps<Date>> = {
  format: 'dd.MM.yyyy',
  views: ['year', 'month', 'day'],
  disableHighlightToday: true,
  slotProps: {
    textField: { sx: { maxWidth: '10rem' }, size: 'small' },
  },
};

export const TicketDateIntervalFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const maxDate = new Date();

  const selectedDatesParam = searchParams.get(TicketSearchParam.CreatedDate);
  const selectedDatesParamArray = selectedDatesParam ? selectedDatesParam.split(',') : [];

  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(
    selectedDatesParamArray.length ? new Date(selectedDatesParamArray.shift() || '') : null
  );

  const [selectedToDate, setSelectedToDate] = useState<Date | null>(
    selectedDatesParamArray.length ? new Date(selectedDatesParamArray.pop() || '') : null
  );

  const onChangeFromDate = (newDate: Date | null) => {
    setSelectedFromDate(newDate);

    const selectedFromDateString = newDate ? formatDateStringToISO(newDate) : '';

    const newDateParam = selectedFromDateString + (selectedToDate ? `,${formatDateStringToISO(selectedToDate)}` : '');

    updateSearchParams(newDateParam);
  };

  const onChangeToDate = (newDate: Date | null) => {
    setSelectedToDate(newDate);

    const selectedToDateString = newDate ? formatDateStringToISO(newDate) : '';

    const newDateParam =
      (selectedFromDate ? `${formatDateStringToISO(selectedFromDate)}` : '') + `,${selectedToDateString}`;

    updateSearchParams(newDateParam);
  };

  const updateSearchParams = (newDateParam: string) => {
    if (newDateParam !== '') {
      searchParams.set(TicketSearchParam.CreatedDate, newDateParam);
    } else {
      searchParams.delete(TicketSearchParam.CreatedDate);
    }
    history.push({ search: searchParams.toString() });
  };

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
      <DatePicker
        {...commonDatepickerProps}
        data-testid={dataTestId.myPage.myMessages.ticketFilterFromDatePicker}
        label={t('registration.resource_type.date_from')}
        value={selectedFromDate}
        maxDate={selectedToDate ? selectedToDate : maxDate}
        onChange={(date, context) => {
          if (context.validationError !== 'invalidDate') {
            onChangeFromDate(date);
          }
        }}
      />
      <DatePicker
        {...commonDatepickerProps}
        data-testid={dataTestId.myPage.myMessages.ticketFilterToDatePicker}
        label={t('registration.resource_type.date_to')}
        value={selectedToDate}
        maxDate={maxDate}
        minDate={selectedFromDate ? selectedFromDate : undefined}
        onChange={(date, context) => {
          if (context.validationError !== 'invalidDate') {
            onChangeToDate(date);
          }
        }}
      />
    </Box>
  );
};
