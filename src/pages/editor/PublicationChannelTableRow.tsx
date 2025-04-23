import { TableCell, TableRow, Typography } from '@mui/material';
import { useFetchPublisher } from '../../api/hooks/useFetchPublisher';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { getLanguageString } from '../../utils/translation-helpers';

interface PublicationChannelTableRowProps {
  claim: ClaimedChannel;
}
export const PublicationChannelTableRow = ({ claim }: PublicationChannelTableRowProps) => {
  const { t } = useTranslation();
  const publisher = useFetchPublisher(getIdentifierFromId(claim.channelClaim.channel));
  const publisherName = publisher ? publisher.data?.name : '';

  const organization = useFetchOrganization(claim.claimedBy.organizationId);
  const organizationName = organization ? getLanguageString(organization.data?.labels) : '';

  return (
    <TableRow key={claim.id}>
      <TableCell>{!!publisherName ? publisherName : t('common.unknown')}</TableCell>
      <TableCell>{!!organizationName ? organizationName : t('common.unknown')}</TableCell>
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
