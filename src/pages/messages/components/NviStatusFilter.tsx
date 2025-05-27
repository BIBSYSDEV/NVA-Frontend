import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const NviStatusFilter = () => {
  const { t } = useTranslation();

  return (
    <TextField select size="small" label={t('common.status')}>
      <MenuItem value="Pending">{t('tasks.nvi.status.Pending')}</MenuItem>
      <MenuItem value="Approved">{t('tasks.nvi.status.Approved')}</MenuItem>
      <MenuItem value="Rejected">{t('tasks.nvi.status.Rejected')}</MenuItem>
      <MenuItem value="Dispute">{t('tasks.nvi.status.Dispute')}</MenuItem>
    </TextField>
  );
};
