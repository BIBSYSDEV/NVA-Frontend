import { Box, BoxProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../api/searchApi';
import { syncParamsWithSearchFields } from '../../utils/searchHelpers';

const commonDatepickerProps: Partial<DatePickerProps<Date>> = {
  views: ['year'],
  disableHighlightToday: true,
  slotProps: { textField: { sx: { maxWidth: '10rem' }, size: 'small' } },
};

interface PublicationDateIntervalFilterProps {
  boxProps?: Pick<BoxProps, 'sx'>;
  datePickerProps?: Partial<DatePickerProps<Date>>;
}

const defaultMaxDate = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

export const PublicationYearIntervalFilter = ({ datePickerProps, boxProps }: PublicationDateIntervalFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const selectedYearSinceParam = searchParams.get(ResultParam.PublicationYearSince);
  const selectedYearBeforeParam = searchParams.get(ResultParam.PublicationYearBefore);

  const selectedYearSinceDate = selectedYearSinceParam ? new Date(selectedYearSinceParam) : undefined;
  const selectedYearBeforeDate = selectedYearBeforeParam ? new Date(selectedYearBeforeParam) : undefined;

  const onChangeDate = (
    newDate: Date | null,
    param: ResultParam.PublicationYearSince | ResultParam.PublicationYearBefore
  ) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (newDate) {
      const year = newDate.getFullYear();
      if (year.toString().length === 4) {
        if (param === ResultParam.PublicationYearBefore) {
          syncedParams.set(param, (year + 1).toString());
        } else {
          syncedParams.set(param, year.toString());
        }
        syncedParams.delete(ResultParam.From);
        navigate({ search: syncedParams.toString() });
      }
    } else {
      syncedParams.delete(param);
      syncedParams.delete(ResultParam.From);
      navigate({ search: syncedParams.toString() });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: '1rem', ...boxProps?.sx }}>
      <DatePicker
        {...commonDatepickerProps}
        {...datePickerProps}
        label={t('search.year_from')}
        value={selectedYearSinceDate ?? null}
        maxDate={
          selectedYearBeforeDate
            ? new Date(selectedYearBeforeDate.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
            : defaultMaxDate
        }
        onChange={(date) => onChangeDate(date, ResultParam.PublicationYearSince)}
      />
      <DatePicker
        {...commonDatepickerProps}
        {...datePickerProps}
        label={t('search.year_to')}
        value={
          selectedYearBeforeDate ? new Date(selectedYearBeforeDate.getFullYear() - 1, 11, 31, 23, 59, 59, 999) : null
        }
        minDate={selectedYearSinceDate}
        maxDate={defaultMaxDate}
        onChange={(date) => onChangeDate(date, ResultParam.PublicationYearBefore)}
      />
    </Box>
  );
};
