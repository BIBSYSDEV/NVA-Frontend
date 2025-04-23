import { TableCell, TableRow, Typography } from '@mui/material';
import { useFetchPublisher } from '../../api/hooks/useFetchPublisher';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { getIdentifierFromId } from '../../utils/general-helpers';

interface PublicationChannelTableRowProps {
  claim: ClaimedChannel;
}
export const PublicationChannelTableRow = ({ claim }: PublicationChannelTableRowProps) => {
  const publisher = useFetchPublisher(getIdentifierFromId(claim.channelClaim.channel));
  const publisherName = publisher ? publisher.data?.name : '';

  return (
    <TableRow key={claim.id}>
      <TableCell>{publisherName}</TableCell>
      <TableCell>{claim.claimedBy.organizationId}</TableCell>
      <TableCell>{claim.channelClaim.constraint.publishingPolicy}</TableCell>
      <TableCell>{claim.channelClaim.constraint.editingPolicy}</TableCell>
      <TableCell>
        {claim.channelClaim.constraint.scope.map((scope, index) => (
          <Typography key={index}>{scope}</Typography>
        ))}
      </TableCell>
    </TableRow>
  );
};
