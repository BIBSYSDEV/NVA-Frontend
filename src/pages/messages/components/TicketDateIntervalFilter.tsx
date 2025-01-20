import { Box } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { TicketSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { formatDateStringToISO } from '../../../utils/date-helpers';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

const commonDatepickerProps: Partial<DatePickerProps<Date>> = {
  views: ['year', 'month', 'day'],
  disableHighlightToday: true,
  slotProps: {
    textField: { sx: { maxWidth: '10rem' }, size: 'small' },
  },
};

const startsWithFourDigitYear = (date: string) => {
  return date.match(/^\d{4}-/);
};

export const TicketDateIntervalFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const maxDate = new Date();

  const selectedDatesParam = searchParams.get(TicketSearchParam.CreatedDate);
  const [selectedFromDate, selectedToDate] = selectedDatesParam ? selectedDatesParam.split(',') : ['', ''];

  const updateSearchParams = (newFromDate: string, newToDate: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (newFromDate || newToDate) {
      syncedParams.set(TicketSearchParam.CreatedDate, `${newFromDate},${newToDate}`);
    } else {
      syncedParams.delete(TicketSearchParam.CreatedDate);
    }
    navigate({ search: syncedParams.toString() });
  };

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
      <DatePicker
        {...commonDatepickerProps}
        data-testid={dataTestId.myPage.myMessages.ticketFilterFromDatePicker}
        label={t('registration.resource_type.date_from')}
        value={selectedFromDate ? new Date(selectedFromDate) : null}
        maxDate={selectedToDate ? new Date(selectedToDate) : maxDate}
        onChange={(date, context) => {
          if (context.validationError !== 'invalidDate') {
            const isoDate = date ? formatDateStringToISO(date) : '';
            updateSearchParams(isoDate && startsWithFourDigitYear(isoDate) ? isoDate : '', selectedToDate);
          }
        }}
      />
      <DatePicker
        {...commonDatepickerProps}
        data-testid={dataTestId.myPage.myMessages.ticketFilterToDatePicker}
        label={t('registration.resource_type.date_to')}
        value={selectedToDate ? new Date(selectedToDate) : null}
        maxDate={maxDate}
        minDate={selectedFromDate ? new Date(selectedFromDate) : undefined}
        onChange={(date, context) => {
          if (context.validationError !== 'invalidDate') {
            const isoDate = date ? formatDateStringToISO(date) : '';
            updateSearchParams(selectedFromDate, isoDate && startsWithFourDigitYear(isoDate) ? isoDate : '');
          }
        }}
      />
    </Box>
  );
};
