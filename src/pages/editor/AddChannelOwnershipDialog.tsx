import { Button, Dialog, DialogActions, DialogProps, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Publisher } from '../../types/registration.types';

interface AddChannelOwnershipDialogProps extends Pick<DialogProps, 'open'> {
  channelType: Publisher['type'];
  closeDialog: () => void;
}

export const AddChannelOwnershipDialog = ({ channelType, open, closeDialog }: AddChannelOwnershipDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>{t('editor.institution.add_publisher_channel_ownership')}</DialogTitle>
      <DialogActions>
        <Button onClick={() => closeDialog()}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={() => closeDialog()}>
          {t('editor.institution.set_ownership')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
