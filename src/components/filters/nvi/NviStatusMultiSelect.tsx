import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { NviPeriodStatusEnum } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';

const statusOptions = [
  { value: NviPeriodStatusEnum.UnopenedPeriod, labelKey: 'nvi_period_status_not_opened' },
  { value: NviPeriodStatusEnum.OpenPeriod, labelKey: 'nvi_period_status_ongoing' },
  { value: NviPeriodStatusEnum.ClosedPeriod, labelKey: 'nvi_period_status_closed' },
  { value: NviPeriodStatusEnum.ReportedPeriod, labelKey: 'nvi_period_status_reported' },
] as const;

export const allFilterableNviPeriodStatuses = statusOptions.map(({ value }) => value);

export const PARAM_NAME_PERIOD_STATUSES = 'periodStatuses';

/**
 * Multi-select filter for NVI period statuses.
 * Reads and writes the `periodStatuses` query param as a comma-separated list of {@link NviPeriodStatusEnum} values.
 */
export const NviStatusMultiSelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const periodStatuses = (searchParams.get(PARAM_NAME_PERIOD_STATUSES) ?? '').split(',').filter(Boolean);

  const handleChange = (value: string, checked: boolean) => {
    const newSelectedStatuses = checked
      ? [...periodStatuses, value]
      : periodStatuses.filter((status) => status !== value);

    if (newSelectedStatuses.length === 0) {
      searchParams.delete(PARAM_NAME_PERIOD_STATUSES);
    } else {
      searchParams.set(PARAM_NAME_PERIOD_STATUSES, newSelectedStatuses.join(','));
    }
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        {t('status_on_nvi_period')}
      </FormLabel>
      <FormGroup row>
        {statusOptions.map(({ value, labelKey }) => (
          <FormControlLabel
            key={value}
            control={
              <Checkbox
                checked={periodStatuses.includes(value)}
                data-testid={dataTestId.basicData.nviPeriod.statusFilterCheckbox(value)}
                onChange={(_, checked) => handleChange(value, checked)}
              />
            }
            label={t(labelKey)}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};
