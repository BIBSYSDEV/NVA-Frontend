import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ChannelClaimType, ClaimedChannel } from '../../types/customerInstitution.types';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ChannelClaimTableRow } from './ChannelClaimTableRow';

interface ChannelClaimTableProps {
  channelClaimList: ClaimedChannel[];
  channelType: ChannelClaimType;
}

export const ChannelClaimTable = ({ channelClaimList, channelType }: ChannelClaimTableProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isOnSettingsPage = location.pathname.startsWith(UrlPathTemplate.InstitutionSettings);

  return (
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: 'secondary.main' }}>
          <TableCell>{channelType === 'publisher' ? t('common.publisher') : t('common.serial_publication')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.channel_owner')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.publishing_access')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.editing_access')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.category_limitations')}</TableCell>
          {isOnSettingsPage && <TableCell></TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {channelClaimList.map((channel) => (
          <ChannelClaimTableRow
            key={channel.id}
            claimedChannel={channel}
            channelType={channelType}
            isOnSettingsPage={isOnSettingsPage}
          />
        ))}
      </TableBody>
    </Table>
  );
};
