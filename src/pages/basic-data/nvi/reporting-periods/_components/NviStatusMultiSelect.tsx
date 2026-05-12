import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HorizontalBox, VerticalBox } from '../../../../../components/styled/Wrappers';

export const NviStatusMultiSelect = () => {
  const { t } = useTranslation();
  return (
    <VerticalBox>
      <Typography sx={{ color: 'lightgray' }}>{t('status_on_nvi_period')}</Typography>
      <HorizontalBox>
        <FormControlLabel control={<Checkbox />} label={t('nvi_period_status_not_opened')} />
        <FormControlLabel control={<Checkbox />} label={t('nvi_period_status_ongoing')} />
        <FormControlLabel control={<Checkbox />} label={t('nvi_period_status_closed')} />
        <FormControlLabel control={<Checkbox />} label={t('nvi_period_status_reported')} />
      </HorizontalBox>
    </VerticalBox>
  );
};
