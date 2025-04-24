import { Chip, styled, TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { useFetchPublisher } from '../../api/hooks/useFetchPublisher';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

interface ChannelClaimTableRowProps {
  claimedChannel: ClaimedChannel;
}
const StyledTableCell = styled(TableCell)({
  verticalAllign: 'top',
});
export const ChannelClaimTableRow = ({ claimedChannel }: ChannelClaimTableRowProps) => {
  const { t } = useTranslation();
  const publisher = useFetchPublisher(getIdentifierFromId(claimedChannel.channelClaim.channel));
  const publisherName = publisher ? publisher.data?.name : '';

  const organization = useFetchOrganization(claimedChannel.claimedBy.organizationId);
  const organizationName = organization ? getLanguageString(organization.data?.labels) : '';

  return (
    <TableRow>
      <StyledTableCell>
        {publisherName ? publisherName : <span style={{ fontStyle: 'italic' }}>{t('common.unknown')}</span>}
      </StyledTableCell>
      <StyledTableCell>
        {organizationName ? organizationName : <span style={{ fontStyle: 'italic' }}>{t('common.unknown')}</span>}
      </StyledTableCell>
      <StyledTableCell>{claimedChannel.channelClaim.constraint.publishingPolicy}</StyledTableCell>
      <StyledTableCell>{claimedChannel.channelClaim.constraint.editingPolicy}</StyledTableCell>
      <TableCell sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', verticalAlign: 'top' }}>
        {claimedChannel.channelClaim.constraint.scope.map((scope) => (
          <Chip key={scope} label={scope} />
        ))}
      </TableCell>
    </TableRow>
  );
};
