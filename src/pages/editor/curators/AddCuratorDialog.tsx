import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const AddCuratorDialog = ({ ...dialogProps }: DialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog {...dialogProps} maxWidth="md" fullWidth>
      <DialogTitle>Add Curator</DialogTitle>
      <DialogContent>TODO</DialogContent>
      <DialogActions>
        <Button>{t('common.cancel')}</Button>
        <Button>{t('common.add')}</Button>
      </DialogActions>
    </Dialog>
  );
};
