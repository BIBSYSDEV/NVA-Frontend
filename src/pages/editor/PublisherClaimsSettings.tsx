import AddIcon from '@mui/icons-material/Add';
import { Button, TableContainer, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { useFetchChannelClaims } from '../../api/hooks/useFetchChannelClaims';
import { PageSpinner } from '../../components/PageSpinner';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { filterChannelClaims } from '../../utils/institutions-helpers';
import { AddChannelClaimDialog } from './AddChannelClaimDialog';
import { ChannelClaimFilter } from './ChannelClaimFilter';
import { ChannelClaimTable } from './ChannelClaimTable';

export const PublisherClaimsSettings = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customerId = user?.customerId ?? '';

  const [openAddChannelClaimDialog, setOpenAddChannelClaimDialog] = useState(false);
  const toggleAddChannelClaimDialog = () => setOpenAddChannelClaimDialog(!openAddChannelClaimDialog);

  const channelClaimsQuery = useFetchChannelClaims('publisher');

  const channelClaims = channelClaimsQuery.data?.channelClaims;

  const [searchParams] = useSearchParams();
  const shouldFilter = !!searchParams.get('viewingOptions');

  const channelClaimList = channelClaims ? filterChannelClaims(channelClaims, shouldFilter, customerId) : [];

  return (
    <>
      <Helmet>
        <title>{t('editor.institution.channel_claims.administer_publisher_channel_claim')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.channel_claims.administer_publisher_channel_claim')}
      </Typography>
      <Trans
        i18nKey="editor.institution.channel_claims.administer_publisher_channel_claim_description"
        components={{
          p: <Typography gutterBottom />,
          button: (
            <Button
              data-testid={dataTestId.editor.addChannelClaimButton}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ my: '0.5rem', textTransform: 'none' }}
              onClick={toggleAddChannelClaimDialog}>
              {t('editor.institution.channel_claims.add_publisher_channel_claim')}
            </Button>
          ),
        }}
      />

      <ChannelClaimFilter />

      <TableContainer aria-live="polite" aria-busy={channelClaimsQuery.isPending} sx={{ mt: '1rem' }}>
        {channelClaimsQuery.isPending ? (
          <PageSpinner aria-label={t('editor.institution.channel_claims.channel_claim')} />
        ) : channelClaimList && channelClaimList.length > 0 ? (
          <ChannelClaimTable channelClaimList={channelClaimList} channelType={'publisher'} />
        ) : null}
      </TableContainer>

      <AddChannelClaimDialog
        open={openAddChannelClaimDialog}
        closeDialog={toggleAddChannelClaimDialog}
        refetchClaimedChannels={channelClaimsQuery.refetch}
        channelType={'publisher'}
      />
    </>
  );
};
