import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const NviStatusMultiSelect = () => {
  const { t } = useTranslation();
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        {t('status_on_nvi_period')}
      </FormLabel>
      <FormGroup row>
        <FormControlLabel control={<Checkbox />} label={t('nvi_period_status_not_opened')} />
        <FormControlLabel control={<Checkbox />} label={t('nvi_period_status_ongoing')} />
        <FormControlLabel control={<Checkbox />} label={t('nvi_period_status_closed')} />
        <FormControlLabel control={<Checkbox />} label={t('nvi_period_status_reported')} />
      </FormGroup>
    </FormControl>
  );
};
