import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Publisher } from '../../types/registration.types';
import { SearchForPublisherFacetItem } from '../search/facet_search_fields/SearchForPublisherFacetItem';

interface AddChannelOwnershipDialogProps extends Pick<DialogProps, 'open'> {
  channelType: Publisher['type'];
  closeDialog: () => void;
}

export const AddChannelOwnershipDialog = ({ channelType, open, closeDialog }: AddChannelOwnershipDialogProps) => {
  const { t } = useTranslation();
  const [selectedChannel, setSelectedChannel] = useState<Publisher>();

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>{t('editor.institution.add_publisher_channel_ownership')}</DialogTitle>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log(event.currentTarget);
          console.log('submit', selectedChannel);
          closeDialog();
        }}>
        <DialogContent>
          <Trans
            i18nKey="editor.institution.add_publisher_ownership_description"
            components={{ p: <Typography sx={{ mb: '1rem' }} /> }}
          />
          <SearchForPublisherFacetItem
            onSelectPublisher={(publisher) => {
              console.log('velger', publisher);
              setSelectedChannel(publisher);
            }}
            textFieldProps={{ variant: 'filled', label: t('common.publisher'), required: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>{t('common.cancel')}</Button>
          <Button
            // data-testid="add-channel-ownership"
            type="submit"
            variant="contained"
            disabled={!selectedChannel}>
            {t('editor.institution.set_ownership')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
