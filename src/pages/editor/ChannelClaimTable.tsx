import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ClaimedChannel, SelectedPublicationChannelType } from '../../types/customerInstitution.types';
import { PublicationChannelType } from '../../types/registration.types';
import { ChannelClaimTableRow } from './PublicationChannelTableRow';

interface ChannelClaimTableProps {
  channelClaimList: ClaimedChannel[];
  channelType: SelectedPublicationChannelType;
}

export const ChannelClaimTable = ({ channelClaimList, channelType }: ChannelClaimTableProps) => {
  const { t } = useTranslation();
  const claimedChannels = filterClaimedChannels({ channelClaimList, channelType }) ?? [];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('common.publisher')}</TableCell>
            <TableCell>{t('editor.institution.channel_claims.channel_owner')}</TableCell>
            <TableCell>{t('editor.institution.channel_claims.publishing_access')}</TableCell>
            <TableCell>{t('editor.institution.channel_claims.editing_access')}</TableCell>
            <TableCell>{t('editor.institution.channel_claims.category_limitations')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {claimedChannels.map((channel, index) => (
            <ChannelClaimTableRow channel={channel} key={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const filterClaimedChannels = ({ channelClaimList, channelType }: ChannelClaimTableProps) => {
  if (channelType === PublicationChannelType.Publisher) {
    return channelClaimList.filter((channel) => channel.channelClaim.channel.includes('/publisher'));
  }
};
