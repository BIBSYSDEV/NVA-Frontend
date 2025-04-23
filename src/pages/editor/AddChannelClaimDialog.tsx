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
import { AxiosError } from 'axios';
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

interface AddChannelClaimDialogProps extends Pick<DialogProps, 'open'> {
  closeDialog: () => void;
}

export const AddChannelClaimDialog = ({ open, closeDialog }: AddChannelClaimDialogProps) => {
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
          constraint: {
            scope: selectedCategories,
            publishingPolicy: 'Everyone',
            editingPolicy: 'OwnerOnly',
          },
        });
      }
      return Promise.reject(new Error('Customer ID or Publisher ID is missing'));
    },
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.set_channel_claim'), variant: 'success' }));
      closeDialog();
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      dispatch(
        setNotification({
          message: t('feedback.error.set_channel_claim'),
          variant: 'error',
          detail: error.response?.data.detail,
        })
      );
    },
  });

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>{t('editor.institution.add_publisher_channel_claim')}</DialogTitle>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (selectedChannel) {
            await addChannelClaim.mutateAsync(selectedChannel.id);
          }
          closeDialog();
        }}>
        <DialogContent>
          <Trans
            i18nKey="editor.institution.add_publisher_claim_description"
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
                label={t(`registration.publication_types.${category}`)}
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
            {t('editor.institution.set_channel_claim')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
