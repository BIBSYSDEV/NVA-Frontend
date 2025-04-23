import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setChannelClaim } from '../../api/customerInstitutionsApi';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { DegreeType } from '../../types/publicationFieldNames';
import { PublicationInstanceType, Publisher } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchForPublisherFacetItem } from '../search/facet_search_fields/SearchForPublisherFacetItem';

const selectedCategories: PublicationInstanceType[] = Object.values(DegreeType);

interface AddChannelOwnershipDialogProps extends Pick<DialogProps, 'open'> {
  // channelType: Publisher['type']; // TODO?
  closeDialog: () => void;
}

export const AddChannelOwnershipDialog = ({ open, closeDialog }: AddChannelOwnershipDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const customer = useSelector((state: RootState) => state.customer);
  const [selectedChannel, setSelectedChannel] = useState<Publisher>();

  const addChannelClaim = useMutation({
    mutationFn: (publisherId: string) => {
      if (customer?.id && publisherId) {
        const channelIdWithoutYear = publisherId.replace(/\/\d{4}$/, '');
        return setChannelClaim(customer.id, {
          channel: channelIdWithoutYear,
          constraints: {
            scope: selectedCategories,
            publishingPolicy: 'Everyone',
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
          detail: (error as any).response?.data?.detail, // TODO: Simplify type?
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
          if (selectedChannel) {
            // TODO: Get value from form instead of state?
            await addChannelClaim.mutateAsync(selectedChannel.id);
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
          <Typography sx={{ mt: '1rem' }} gutterBottom>
            {t('editor.institution.claim_category_restriction')}:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {selectedCategories.map((category) => (
              <Chip
                key={category}
                variant="filled"
                color="primary"
                label={t(`registration.publication_types.${category}` as any)}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={closeDialog} data-testid={dataTestId.confirmDialog.cancelButton}>
            {t('common.cancel')}
          </Button>
          <Button
            data-testid={dataTestId.confirmDialog.acceptButton}
            type="submit"
            loading={addChannelClaim.isPending}
            variant="contained"
            disabled={!selectedChannel}>
            {t('editor.institution.set_ownership')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
