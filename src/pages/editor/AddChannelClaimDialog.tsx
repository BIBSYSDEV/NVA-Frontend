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
import { SearchForPublisher } from '../../components/SearchForPublisher';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { ChannelClaimType } from '../../types/customerInstitution.types';
import { DegreeType } from '../../types/publicationFieldNames';
import { PublicationInstanceType, Publisher, SerialPublication } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchForSerialPublication } from '../search/facet_search_fields/SearchForSerialPublicationFacetItem';

const selectedCategories: PublicationInstanceType[] = Object.values(DegreeType);

interface AddChannelClaimDialogProps extends Pick<DialogProps, 'open'> {
  closeDialog: () => void;
  refetchClaimedChannels: () => Promise<unknown>;
  channelType: ChannelClaimType;
}

export const AddChannelClaimDialog = ({
  open,
  closeDialog,
  refetchClaimedChannels,
  channelType,
}: AddChannelClaimDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((state: RootState) => state.customer);

  const [selectedPublisherChannel, setSelectedPublisherChannel] = useState<Publisher | null>(null);
  const [selectedSerialPublicationChannel, setSelectedSerialPublicationChannel] = useState<SerialPublication | null>(
    null
  );

  const closeDialogAndResetSelectedChannel = () => {
    closeDialog();
    setSelectedPublisherChannel(null);
  };

  const addChannelClaimMutation = useMutation({
    mutationFn: (channelId: string) => {
      if (customer?.id && channelId) {
        const channelIdWithoutYear = channelId.replace(/\/\d{4}$/, '');
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
    onSuccess: async () => {
      dispatch(setNotification({ message: t('feedback.success.set_channel_claim'), variant: 'success' }));
      await refetchClaimedChannels();
      closeDialogAndResetSelectedChannel();
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
    <Dialog open={open} onClose={closeDialogAndResetSelectedChannel}>
      <DialogTitle>
        {channelType === 'publisher'
          ? t('editor.institution.channel_claims.add_publisher_channel_claim')
          : t('editor.institution.channel_claims.add_serial_publication_channel_claim')}
      </DialogTitle>
      <form
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          if (!!selectedSerialPublicationChannel) {
            await addChannelClaimMutation.mutateAsync(selectedSerialPublicationChannel.id);
          } else if (!!selectedPublisherChannel) {
            await addChannelClaimMutation.mutateAsync(selectedPublisherChannel.id);
          }
          closeDialogAndResetSelectedChannel();
        }}>
        <DialogContent>
          <Trans
            i18nKey={
              channelType === 'publisher'
                ? 'editor.institution.channel_claims.add_publisher_channel_claim_description'
                : 'editor.institution.channel_claims.add_serial_publication_channel_claim_description'
            }
            components={{ p: <Typography sx={{ mb: '1rem' }} /> }}
          />

          {/* TODO:
           * 1) Should not be able to select publishers with scientific level 1 or 2.
           * 2) Should not be able to select already claimed publishers.
           */}
          {channelType === 'publisher' ? (
            <SearchForPublisher
              onSelectPublisher={(publisher) => setSelectedPublisherChannel(publisher)}
              autocompleteProps={{
                value: selectedPublisherChannel,
                disabled: addChannelClaimMutation.isPending,
              }}
              textFieldProps={{
                'data-testid': dataTestId.editor.channelSearchField,
                variant: 'filled',
                label: t('common.publisher'),
                required: true,
              }}
            />
          ) : (
            <SearchForSerialPublication
              searchMode={'serial-publication'}
              onSelectSerialPublication={(serialPublication) => setSelectedSerialPublicationChannel(serialPublication)}
              autocompleteProps={{
                value: selectedSerialPublicationChannel,
                disabled: addChannelClaimMutation.isPending,
              }}
              textFieldProps={{
                'data-testid': dataTestId.editor.channelSearchField,
                variant: 'filled',
                label: t('common.serial_publication'),
                required: true,
              }}
            />
          )}
          <Typography sx={{ mt: '1rem' }} gutterBottom>
            {t('editor.institution.channel_claims.claim_category_restriction')}:
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
          <Button onClick={closeDialogAndResetSelectedChannel} data-testid={dataTestId.confirmDialog.cancelButton}>
            {t('common.cancel')}
          </Button>
          <Button
            data-testid={dataTestId.confirmDialog.acceptButton}
            type="submit"
            loading={addChannelClaimMutation.isPending}
            variant="contained"
            disabled={channelType === 'publisher' ? !selectedPublisherChannel : !selectedSerialPublicationChannel}>
            {t('editor.institution.channel_claims.set_channel_claim')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
