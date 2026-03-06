import { Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ChannelClaimContext } from '../../context/ChannelClaimContext';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { dataTestId } from '../../utils/dataTestIds';
import { HelperTextModal } from '../registration/HelperTextModal';
import { ChannelClaimTableRow } from './ChannelClaimTableRow';

interface ChannelClaimTableProps {
  channelClaimList: ClaimedChannel[];
  canEdit?: boolean;
}

const helperTextModalComponents = {
  p: <Typography sx={{ mb: '1rem' }} />,
  heading: <Typography variant="h2" gutterBottom />,
};

export const ChannelClaimTable = ({ channelClaimList, canEdit = false }: ChannelClaimTableProps) => {
  const { t } = useTranslation();
  const { channelType } = useContext(ChannelClaimContext);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {channelType === 'publisher'
              ? t('editor.institution.channel_claims.publisher_in_channel_registry')
              : t('editor.institution.channel_claims.serial_publication_in_channel_registry')}
          </TableCell>
          <TableCell>
            {t('owner_institution')}
            <HelperTextModal
              buttonDataTestId={dataTestId.editor.channelOwnerInfoButton}
              modalTitle={t('editor.institution.channel_claims.institution_with_editorial_responsibility')}>
              <Trans
                t={t}
                i18nKey="editor.institution.channel_claims.channel_owner_helper_text"
                components={{
                  ...helperTextModalComponents,
                  email: (
                    <Link href="mailto:kontakt@sikt.no" target="_blank" rel="noopener noreferrer">
                      kontakt@sikt.no
                    </Link>
                  ),
                }}
              />
            </HelperTextModal>
          </TableCell>
          <TableCell sx={{ textWrap: 'nowrap' }}>
            {t('editor.institution.channel_claims.register_access')}
            <HelperTextModal
              buttonDataTestId={dataTestId.editor.registerAccessInfoButton}
              modalTitle={t('editor.institution.channel_claims.register_access')}>
              <Trans
                t={t}
                i18nKey="editor.institution.channel_claims.register_access_helper_text"
                components={helperTextModalComponents}
              />
            </HelperTextModal>
          </TableCell>
          <TableCell sx={{ textWrap: 'nowrap' }}>
            {t('editor.institution.channel_claims.editing_access')}
            <HelperTextModal
              buttonDataTestId={dataTestId.editor.editingAccessInfoButton}
              modalTitle={t('editor.institution.channel_claims.editing_access')}>
              <Trans
                t={t}
                i18nKey="editor.institution.channel_claims.editing_access_helper_text"
                components={helperTextModalComponents}
              />
            </HelperTextModal>
          </TableCell>
          <TableCell sx={{ textWrap: 'nowrap' }}>
            {t('editor.institution.channel_claims.category_limitations')}
            <HelperTextModal
              buttonDataTestId={dataTestId.editor.categoryLimitationsInfoButton}
              modalTitle={t('editor.institution.channel_claims.category_limitations')}>
              <Trans
                t={t}
                i18nKey="editor.institution.channel_claims.category_limitations_helper_text"
                components={helperTextModalComponents}
              />
            </HelperTextModal>
          </TableCell>
          {canEdit && <TableCell>{t('common.actions')}</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {channelClaimList.map((claimedChannel) => (
          <ChannelClaimTableRow
            key={claimedChannel.id}
            claimedChannel={claimedChannel}
            channelType={channelType}
            canEdit={canEdit}
          />
        ))}
      </TableBody>
    </Table>
  );
};
