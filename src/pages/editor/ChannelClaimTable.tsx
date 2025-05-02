import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ChannelClaimType, ClaimedChannel } from '../../types/customerInstitution.types';
import { ChannelClaimTableRow } from './ChannelClaimTableRow';

interface ChannelClaimTableProps {
  channelClaimList: ClaimedChannel[];
  channelType: ChannelClaimType;
}

export const ChannelClaimTable = ({ channelClaimList, channelType }: ChannelClaimTableProps) => {
  const { t } = useTranslation();
  const claimedChannels =
    channelType === 'publisher'
      ? channelClaimList.filter((channel) => channel.channelClaim.channel.includes('/publisher'))
      : channelType === 'serial-publication'
        ? channelClaimList.filter((channel) => channel.channelClaim.channel.includes('/serial-publication'))
        : [];

  return (
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: 'secondary.main' }}>
          <TableCell>{channelType === 'publisher' ? t('common.publisher') : t('common.serial_publication')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.channel_owner')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.publishing_access')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.editing_access')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.category_limitations')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {claimedChannels.map((channel) => (
          <ChannelClaimTableRow key={channel.id} claimedChannel={channel} channelType={channelType} />
        ))}
      </TableBody>
    </Table>
  );
};
