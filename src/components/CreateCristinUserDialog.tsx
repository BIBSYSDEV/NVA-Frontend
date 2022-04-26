import { LoadingButton } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CreateCristinUserDialogProps {
  loff?: any;
}

export const CreateCristinUserDialog = ({ loff }: CreateCristinUserDialogProps) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={true} fullWidth maxWidth="sm">
      <DialogTitle>Din brukerprofil</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextField variant="filled" label={t('first_name')} required />
        <TextField variant="filled" label={t('last_name')} required />
      </DialogContent>
      <DialogActions>
        <LoadingButton variant="contained">{'common:create'}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
