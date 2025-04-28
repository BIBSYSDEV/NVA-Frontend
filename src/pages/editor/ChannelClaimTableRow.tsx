import { Chip, Skeleton, styled, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { useFetchPublisher } from '../../api/hooks/useFetchPublisher';
import { StatusChip } from '../../components/StatusChip';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { getLanguageString } from '../../utils/translation-helpers';

interface ChannelClaimTableRowProps {
  claimedChannel: ClaimedChannel;
}
const StyledTableCell = styled(TableCell)({
  verticalAlign: 'top',
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
      <StyledTableCell aria-live="polite">
        {publisherQuery.isPending ? (
          <Skeleton width={300} />
        ) : publisherName ? (
          publisherName
        ) : (
          <span style={{ fontStyle: 'italic' }}>{t('common.unknown')}</span>
        )}
      </StyledTableCell>
      <StyledTableCell aria-live="polite">
        {organizationQuery.isPending ? (
          <Skeleton width={300} />
        ) : organizationName ? (
          <Typography>{organizationName}</Typography>
        ) : (
          <span style={{ fontStyle: 'italic' }}>{t('common.unknown')}</span>
        )}
      </StyledTableCell>
      <StyledTableCell>
        <StatusChip
          sx={{ textWrap: 'nowrap' }}
          text={t(`editor.institution.channel_claims.access_policies.${publishingPolicy}`)}
          icon={publishingPolicy === 'Everyone' ? 'open' : 'locked'}
          bgcolor={publishingPolicy === 'Everyone' ? 'publishingRequest.main' : 'centralImport.main'}
        />
      </StyledTableCell>
      <StyledTableCell>
        <StatusChip
          sx={{ textWrap: 'nowrap' }}
          text={t(`editor.institution.channel_claims.access_policies.${editingPolicy}`)}
          icon={editingPolicy === 'Everyone' ? 'open' : 'locked'}
          bgcolor={editingPolicy === 'Everyone' ? 'publishingRequest.main' : 'centralImport.main'}
        />
      </StyledTableCell>
      <StyledTableCell sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '30rem' }}>
        {claimedChannel.channelClaim.constraint.scope.map((scope) => (
          <Chip
            key={scope}
            sx={{ width: 'fit-content' }}
            variant="filled"
            color="primary"
            label={t(`registration.publication_types.${scope}`)}
          />
        ))}
      </StyledTableCell>
    </TableRow>
  );
};
