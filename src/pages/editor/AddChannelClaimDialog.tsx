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
import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setChannelClaim } from '../../api/customerInstitutionsApi';
import { CustomersAutocomplete } from '../../components/CustomersAutocomplete';
import { SearchForPublisher } from '../../components/SearchForPublisher';
import { ChannelClaimContext } from '../../context/ChannelClaimContext';
import { setNotification } from '../../redux/notificationSlice';
import { DegreeType } from '../../types/publicationFieldNames';
import { PublicationInstanceType, Publisher, SerialPublication } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { removeTrailingYearPathFromUrl } from '../../utils/general-helpers';
import { SearchForSerialPublication } from '../search/facet_search_fields/SearchForSerialPublication';

const selectedCategories: PublicationInstanceType[] = Object.values(DegreeType);

interface ChannelClaimMutationData {
  channelId: string;
  customerId: string;
}

interface AddChannelClaimDialogProps extends Pick<DialogProps, 'open'> {
  closeDialog: () => void;
}

export const AddChannelClaimDialog = ({ open, closeDialog }: AddChannelClaimDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { refetchClaimedChannels, channelType } = useContext(ChannelClaimContext);
  const isPublisherChannelClaim = channelType === 'publisher';

  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [selectedSerialPublication, setSelectedSerialPublication] = useState<SerialPublication | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const closeDialogAndResetSelectedChannel = () => {
    closeDialog();
    if (isPublisherChannelClaim) {
      setSelectedPublisher(null);
    } else {
      setSelectedSerialPublication(null);
    }
  };

  const addChannelClaimMutation = useMutation({
    mutationFn: ({ channelId, customerId }: ChannelClaimMutationData) =>
      setChannelClaim(customerId, {
        channel: removeTrailingYearPathFromUrl(channelId),
        constraint: {
          scope: selectedCategories,
          publishingPolicy: 'Everyone',
          editingPolicy: 'OwnerOnly',
        },
      }),
    onSuccess: async () => {
      if (refetchClaimedChannels) {
        await refetchClaimedChannels();
      }
      dispatch(setNotification({ message: t('feedback.success.set_channel_claim'), variant: 'success' }));
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
        {isPublisherChannelClaim
          ? t('editor.institution.channel_claims.add_publisher_channel_claim')
          : t('editor.institution.channel_claims.add_serial_publication_channel_claim')}
      </DialogTitle>
      <form
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            if (selectedSerialPublication) {
              await addChannelClaimMutation.mutateAsync({
                channelId: selectedSerialPublication.id,
                customerId: selectedCustomerId,
              });
            } else if (selectedPublisher) {
              await addChannelClaimMutation.mutateAsync({
                channelId: selectedPublisher.id,
                customerId: selectedCustomerId,
              });
            }
            closeDialogAndResetSelectedChannel();
          } catch {}
        }}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isPublisherChannelClaim ? (
            <Trans
              i18nKey="editor.institution.channel_claims.add_publisher_channel_claim_description"
              components={{ p: <Typography /> }}
            />
          ) : (
            <Trans
              i18nKey="editor.institution.channel_claims.add_serial_publication_channel_claim_description"
              components={{ p: <Typography /> }}
            />
          )}

          <CustomersAutocomplete
            disabled={addChannelClaimMutation.isPending}
            onChange={(_, customer) => setSelectedCustomerId(customer?.id ?? '')}
          />

          {isPublisherChannelClaim ? (
            <SearchForPublisher
              onSelectPublisher={(publisher) => setSelectedPublisher(publisher)}
              autocompleteProps={{
                value: selectedPublisher,
                disabled: addChannelClaimMutation.isPending,
                getOptionDisabled: (option) =>
                  option.scientificValue === 'LevelOne' || option.scientificValue === 'LevelTwo',
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
              searchMode="serial-publication"
              onSelectSerialPublication={(serialPublication) => setSelectedSerialPublication(serialPublication)}
              autocompleteProps={{
                value: selectedSerialPublication,
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

          <div>
            <Typography gutterBottom>{t('editor.institution.channel_claims.claim_category_restriction')}:</Typography>
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
          </div>
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
            disabled={(!selectedPublisher && !selectedSerialPublication) || !selectedCustomerId}>
            {t('editor.institution.channel_claims.set_channel_claim')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
