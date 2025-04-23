import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setChannelClaim } from '../../api/customerInstitutionsApi';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { DegreeType } from '../../types/publicationFieldNames';
import { Publisher } from '../../types/registration.types';
import { SearchForPublisherFacetItem } from '../search/facet_search_fields/SearchForPublisherFacetItem';

interface AddChannelOwnershipDialogProps extends Pick<DialogProps, 'open'> {
  channelType: Publisher['type'];
  closeDialog: () => void;
}

export const AddChannelOwnershipDialog = ({ channelType, open, closeDialog }: AddChannelOwnershipDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const customer = useSelector((state: RootState) => state.customer);
  const [selectedChannel, setSelectedChannel] = useState<Publisher>();

  const addChannelClaim = useMutation({
    mutationFn: (publisher: Publisher) => {
      if (customer?.id && publisher.id) {
        const channelIdWithoutYear = publisher.id.replace(/\/\d{4}$/, '');
        return setChannelClaim(customer.id, {
          channel: channelIdWithoutYear,
          constraints: {
            scope: Object.values(DegreeType),
            publishingPolicy: 'OwnerOnly',
            editingPolicy: 'OwnerOnly',
          },
        });
      }
      return Promise.reject(new Error('Customer ID or Publisher ID is missing'));
    },
    onSuccess: () => {
      dispatch(setNotification({ message: 'Kanaleierskap ble oppdatert', variant: 'success' }));
      closeDialog();
    },
    onError: (error) => {
      dispatch(
        setNotification({
          message: 'Kunne ikke sette kanaleierskap',
          variant: 'error',
          detail: (error as any).response?.data?.detail,
        })
      );
    },
  });

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>{t('editor.institution.add_publisher_channel_ownership')}</DialogTitle>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          console.log('submit', selectedChannel);
          if (selectedChannel) {
            await addChannelClaim.mutateAsync(selectedChannel);
          }
          closeDialog();
        }}>
        <DialogContent>
          <Trans
            i18nKey="editor.institution.add_publisher_ownership_description"
            components={{ p: <Typography sx={{ mb: '1rem' }} /> }}
          />
          <SearchForPublisherFacetItem
            onSelectPublisher={(publisher) => {
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
