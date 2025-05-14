import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ChannelClaimContext } from '../../context/ChannelClaimContext';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { HelperTextModal } from '../registration/HelperTextModal';
import { ChannelClaimTableRow } from './ChannelClaimTableRow';

interface ChannelClaimTableProps {
  channelClaimList: ClaimedChannel[];
}

const helperTextModalComponents = {
  p: <Typography />,
  heading: <Typography variant="h2" sx={{ mt: '1rem' }} />,
};

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
          <TableCell>
            {t('editor.institution.channel_claims.channel_owner')}
            <HelperTextModal modalTitle={t('editor.institution.channel_claims.channel_owner')}>
              <Trans
                i18nKey="editor.institution.channel_claims.channel_owner_helper_text"
                components={helperTextModalComponents}
              />
            </HelperTextModal>
          </TableCell>
          <TableCell sx={{ textWrap: 'nowrap' }}>
            {t('editor.institution.channel_claims.register_access')}
            <HelperTextModal modalTitle={t('editor.institution.channel_claims.register_access')}>
              <Trans
                i18nKey="editor.institution.channel_claims.register_access_helper_text"
                components={helperTextModalComponents}
              />
            </HelperTextModal>
          </TableCell>
          <TableCell sx={{ textWrap: 'nowrap' }}>
            {t('editor.institution.channel_claims.editing_access')}
            <HelperTextModal modalTitle={t('editor.institution.channel_claims.editing_access')}>
              <Trans
                i18nKey="editor.institution.channel_claims.editing_access_helper_text"
                components={helperTextModalComponents}
              />
            </HelperTextModal>
          </TableCell>
          <TableCell sx={{ textWrap: 'nowrap' }}>
            {t('editor.institution.channel_claims.category_limitations')}
            <HelperTextModal modalTitle={t('editor.institution.channel_claims.category_limitations')}>
              <Trans
                i18nKey="editor.institution.channel_claims.category_limitations_helper_text"
                components={helperTextModalComponents}
              />
            </HelperTextModal>
          </TableCell>
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
