import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { Chip, IconButton, Skeleton, styled, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResource } from '../../api/commonApi';
import { deleteChannelClaim } from '../../api/customerInstitutionsApi';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { useFetchPublisher } from '../../api/hooks/useFetchPublisher';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ChannelClaimContext } from '../../context/ChannelClaimContext';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { ChannelClaimType, ClaimedChannel } from '../../types/customerInstitution.types';
import { SerialPublication } from '../../types/registration.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

interface ChannelClaimTableRowProps {
  claimedChannel: ClaimedChannel;
  channelType: ChannelClaimType;
  isOnSettingsPage: boolean;
}

const StyledTableCell = styled(TableCell)({
  verticalAlign: 'top',
});

const StyledChip = styled(Chip)({
  '.MuiChip-label': {
    whiteSpace: 'nowrap',
  },
});

export const ChannelClaimTableRow = ({ claimedChannel, channelType, isOnSettingsPage }: ChannelClaimTableRowProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customerId = user?.customerId ?? '';
  const customerIdentfier = customerId ? getIdentifierFromId(customerId) : '';
  const channelId = claimedChannel.channelClaim.channel;
  const channelIdentifier = getIdentifierFromId(claimedChannel.id);
  const dispatch = useDispatch();
  const context = useContext(ChannelClaimContext);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const isPublisherChannel = channelType === 'publisher';
  const publisherQuery = useFetchPublisher(isPublisherChannel ? channelId : '');

  const serialPublicationQuery = useQuery({
    enabled: !isPublisherChannel,
    queryKey: ['channel', channelId],
    queryFn: () => fetchResource<SerialPublication>(channelId + '/2024'), // TODO: Remove year when NP-48868 is merged
    meta: { errorMessage: t('feedback.error.get_journal') },
    staleTime: Infinity,
  });

  const channelName = isPublisherChannel ? publisherQuery.data?.name : serialPublicationQuery.data?.name;
  const pendingChannelQuery = isPublisherChannel ? publisherQuery.isPending : serialPublicationQuery.isPending;

  const organizationQuery = useFetchOrganization(claimedChannel.claimedBy.organizationId);
  const organizationName = getLanguageString(organizationQuery.data?.labels);

  const publishingPolicy = claimedChannel.channelClaim.constraint.publishingPolicy;
  const editingPolicy = claimedChannel.channelClaim.constraint.editingPolicy;

  const deleteMutation = useMutation({
    mutationFn: async () => await deleteChannelClaim(customerIdentfier, channelIdentifier),
    onSuccess: async () => {
      dispatch(setNotification({ message: t('feedback.success.delete_channel_claim'), variant: 'success' }));
      await context.refetchClaimedChannels();
      setOpenConfirmDialog(false);
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_channel_claim'), variant: 'error' })),
  });

  return (
    <>
      <TableRow sx={{ bgcolor: 'white' }}>
        <StyledTableCell aria-live="polite" aria-busy={pendingChannelQuery}>
          {pendingChannelQuery ? (
            <Skeleton width={300} />
          ) : !!channelName ? (
            <Typography>{channelName}</Typography>
          ) : (
            <Typography sx={{ fontStyle: 'italic' }}>{t('common.unknown')}</Typography>
          )}
        </StyledTableCell>
        <StyledTableCell aria-live="polite" aria-busy={organizationQuery.isPending}>
          {organizationQuery.isPending ? (
            <Skeleton width={300} />
          ) : organizationName ? (
            <Typography>{organizationName}</Typography>
          ) : (
            <Typography sx={{ fontStyle: 'italic' }}>{t('common.unknown')}</Typography>
          )}
        </StyledTableCell>
        <StyledTableCell>
          <StyledChip
            variant="filled"
            color="secondary"
            size="small"
            sx={{
              bgcolor: publishingPolicy === 'Everyone' ? 'publishingRequest.main' : 'centralImport.main',
            }}
            label={t(`editor.institution.channel_claims.access_policies.${publishingPolicy}`)}
            icon={
              publishingPolicy === 'Everyone' ? <LockOpenIcon fontSize="small" /> : <LockOutlineIcon fontSize="small" />
            }
          />
        </StyledTableCell>
        <StyledTableCell>
          <StyledChip
            variant="filled"
            color="secondary"
            size="small"
            sx={{
              bgcolor: editingPolicy === 'Everyone' ? 'publishingRequest.main' : 'centralImport.main',
            }}
            label={t(`editor.institution.channel_claims.access_policies.${editingPolicy}`)}
            icon={
              editingPolicy === 'Everyone' ? <LockOpenIcon fontSize="small" /> : <LockOutlineIcon fontSize="small" />
            }
          />
        </StyledTableCell>
        <StyledTableCell sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {claimedChannel.channelClaim.constraint.scope.map((scope) => (
            <Chip key={scope} variant="filled" color="primary" label={t(`registration.publication_types.${scope}`)} />
          ))}
        </StyledTableCell>
        {isOnSettingsPage && (
          <>
            <StyledTableCell>
              <Tooltip title={t('common.remove')}>
                <IconButton
                  data-testid={`delete-channel-claim-${channelIdentifier}`}
                  onClick={() => setOpenConfirmDialog(true)}
                  size="small"
                  sx={{ width: '1.5rem', height: '1.5rem' }}>
                  <CloseOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </StyledTableCell>
          </>
        )}
      </TableRow>

      <ConfirmDialog
        open={openConfirmDialog}
        title={t('editor.institution.channel_claims.delete_channel_claim')}
        isLoading={deleteMutation.isPending}
        onAccept={async () => await deleteMutation.mutateAsync()}
        onCancel={() => setOpenConfirmDialog(false)}>
        <Trans
          i18nKey="editor.institution.channel_claims.delete_channel_claim_description"
          values={{ name: channelName }}
          components={{ span: <span style={{ fontWeight: 'bold' }} /> }}
        />
      </ConfirmDialog>
    </>
  );
};
