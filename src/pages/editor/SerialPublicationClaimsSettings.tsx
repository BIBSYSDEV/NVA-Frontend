import AddIcon from '@mui/icons-material/Add';
import { Button, TableContainer, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchChannelClaims } from '../../api/hooks/useFetchChannelClaims';
import { PageSpinner } from '../../components/PageSpinner';
import { dataTestId } from '../../utils/dataTestIds';
import { ChannelClaimTable } from './ChannelClaimTable';
import { AddChannelClaimDialog } from './AddChannelClaimDialog';

export const SerialPublicationClaimsSettings = () => {
  const { t } = useTranslation();

  const [openAddChannelClaimDialog, setOpenAddChannelClaimDialog] = useState(false);
  const toggleAddChannelClaimDialog = () => setOpenAddChannelClaimDialog(!openAddChannelClaimDialog);

  const channelClaimsQuery = useFetchChannelClaims('serial-publication');
  const channelClaimList = channelClaimsQuery.data?.channelClaims;

  return (
    <>
      <Helmet>
        <title>{t('editor.institution.channel_claims.administer_serial_publication_channel_claim')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.channel_claims.administer_serial_publication_channel_claim')}
      </Typography>
      <Trans
        i18nKey="editor.institution.channel_claims.administer_serial_publication_channel_claim_description"
        components={{
          p: <Typography gutterBottom />,
          button: (
            <Button
              data-testid={dataTestId.editor.addChannelClaimButton}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ my: '0.5rem', textTransform: 'none' }}
              onClick={toggleAddChannelClaimDialog}>
              {t('editor.institution.channel_claims.add_serial_publication_channel_claim')}
            </Button>
          ),
        }}
      />

      <TableContainer aria-live="polite" aria-busy={channelClaimsQuery.isPending} sx={{ mt: '1rem' }}>
        {channelClaimsQuery.isPending ? (
          <PageSpinner aria-label={t('editor.institution.channel_claims.channel_claim')} />
        ) : channelClaimList && channelClaimList.length > 0 ? (
          <ChannelClaimTable channelClaimList={channelClaimList} channelType={'serial-publication'} />
        ) : null}
      </TableContainer>

      <AddChannelClaimDialog
        open={openAddChannelClaimDialog}
        closeDialog={toggleAddChannelClaimDialog}
        refetchClaimedChannels={channelClaimsQuery.refetch}
        channelType={'serial-publication'}
      />
    </>
  );
};
