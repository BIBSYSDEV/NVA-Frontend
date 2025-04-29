import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { Chip, Skeleton, styled, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { useFetchPublisher } from '../../api/hooks/useFetchPublisher';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { getLanguageString } from '../../utils/translation-helpers';

interface ChannelClaimTableRowProps {
  claimedChannel: ClaimedChannel;
}
const StyledTableCell = styled(TableCell)({
  verticalAlign: 'top',
});

const StyledChip = styled(Chip)({
  '.MuiChip-label': {
    whiteSpace: 'nowrap',
  },
  variant: 'filled',
  color: 'secondary',
});

export const ChannelClaimTableRow = ({ claimedChannel }: ChannelClaimTableRowProps) => {
  const { t } = useTranslation();

  const publisherQuery = useFetchPublisher(claimedChannel.channelClaim.channel);
  const publisherName = publisherQuery.data?.name;

  const organizationQuery = useFetchOrganization(claimedChannel.claimedBy.organizationId);
  const organizationName = getLanguageString(organizationQuery.data?.labels);

  const publishingPolicy = claimedChannel.channelClaim.constraint.publishingPolicy;
  const editingPolicy = claimedChannel.channelClaim.constraint.editingPolicy;

  return (
    <TableRow sx={{ bgcolor: 'white' }}>
      <StyledTableCell aria-live="polite" aria-busy={publisherQuery.isPending}>
        {publisherQuery.isPending ? (
          <Skeleton width={300} />
        ) : publisherName ? (
          <Typography>{publisherName}</Typography>
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
