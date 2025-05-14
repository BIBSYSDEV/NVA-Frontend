import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ChannelClaimContext } from '../../context/ChannelClaimContext';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ChannelClaimTableRow } from './ChannelClaimTableRow';

interface ChannelClaimTableProps {
  channelClaimList: ClaimedChannel[];
}

export const ChannelClaimTable = ({ channelClaimList }: ChannelClaimTableProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isOnSettingsPage = location.pathname.startsWith(UrlPathTemplate.InstitutionSettings);
  const { channelType } = useContext(ChannelClaimContext);

  return (
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: 'secondary.main' }}>
          <TableCell>{channelType === 'publisher' ? t('common.publisher') : t('common.serial_publication')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.channel_owner')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.publishing_access')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.editing_access')}</TableCell>
          <TableCell>{t('editor.institution.channel_claims.category_limitations')}</TableCell>
          {isOnSettingsPage && <TableCell>{t('common.actions')}</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {channelClaimList.map((claimedChannel) => (
          <ChannelClaimTableRow
            key={claimedChannel.id}
            claimedChannel={claimedChannel}
            channelType={channelType}
            isOnSettingsPage={isOnSettingsPage}
          />
        ))}
      </TableBody>
    </Table>
  );
};
