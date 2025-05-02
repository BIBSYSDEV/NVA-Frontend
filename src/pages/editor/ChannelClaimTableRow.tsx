import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { Chip, Skeleton, styled, TableCell, TableRow, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResource } from '../../api/commonApi';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { useFetchPublisher } from '../../api/hooks/useFetchPublisher';
import { ChannelClaimType, ClaimedChannel } from '../../types/customerInstitution.types';
import { SerialPublication } from '../../types/registration.types';
import { getLanguageString } from '../../utils/translation-helpers';

interface ChannelClaimTableRowProps {
  claimedChannel: ClaimedChannel;
  channelType: ChannelClaimType;
}

const StyledTableCell = styled(TableCell)({
  verticalAlign: 'top',
});

const StyledChip = styled(Chip)({
  '.MuiChip-label': {
    whiteSpace: 'nowrap',
  },
});

export const ChannelClaimTableRow = ({ claimedChannel, channelType }: ChannelClaimTableRowProps) => {
  const { t } = useTranslation();
  const channelId = claimedChannel.channelClaim.channel;

  const isPublisherChannel = channelType === 'publisher';

  const publisherQuery = useFetchPublisher(channelId, isPublisherChannel);
  const publisherName = publisherQuery.data?.name;

  const serialPublicationQuery = useQuery({
    enabled: channelType === 'serial-publication',
    queryKey: ['channel', channelId],
    queryFn: () => fetchResource<SerialPublication>(channelId + '/2024'), // TODO: Remove year when NP-48868 is merged
    meta: { errorMessage: t('feedback.error.get_journal') },
    staleTime: Infinity,
  });
  const serialPublicationName = serialPublicationQuery.data?.name;

  const organizationQuery = useFetchOrganization(claimedChannel.claimedBy.organizationId);
  const organizationName = getLanguageString(organizationQuery.data?.labels);

  const publishingPolicy = claimedChannel.channelClaim.constraint.publishingPolicy;
  const editingPolicy = claimedChannel.channelClaim.constraint.editingPolicy;

  return (
    <TableRow sx={{ bgcolor: 'white' }}>
      <StyledTableCell aria-live="polite" aria-busy={publisherQuery.isPending || serialPublicationQuery.isPending}>
        {publisherQuery.isPending || serialPublicationQuery.isPending ? (
          <Skeleton width={300} />
        ) : publisherName || serialPublicationName ? (
          <Typography>{isPublisherChannel ? publisherName : serialPublicationName}</Typography>
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
          icon={editingPolicy === 'Everyone' ? <LockOpenIcon fontSize="small" /> : <LockOutlineIcon fontSize="small" />}
        />
      </StyledTableCell>
      <StyledTableCell sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {claimedChannel.channelClaim.constraint.scope.map((scope) => (
          <Chip key={scope} variant="filled" color="primary" label={t(`registration.publication_types.${scope}`)} />
        ))}
      </StyledTableCell>
    </TableRow>
  );
};
