import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
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
      <DialogContent>
        <Trans
          i18nKey="editor.institution.add_publisher_ownership_description"
          components={{ p: <Typography sx={{ mb: '1rem' }} /> }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>{t('common.cancel')}</Button>
        <Button
          variant="contained"
          onClick={() => {
            // TODO
          }}>
          {t('editor.institution.set_ownership')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
