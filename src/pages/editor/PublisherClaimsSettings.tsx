import AddIcon from '@mui/icons-material/Add';
import { Button, TableContainer, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { useFetchChannelClaims } from '../../api/hooks/useFetchChannelClaims';
import { ChannelClaimParams } from '../../api/searchApi';
import { PageSpinner } from '../../components/PageSpinner';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { ChannelClaimContext } from '../../context/ChannelClaimContext';
import { RootState } from '../../redux/store';
import { filterChannelClaims } from '../../utils/customer-helpers';
import { dataTestId } from '../../utils/dataTestIds';
import { AddChannelClaimDialog } from './AddChannelClaimDialog';
import { ChannelClaimTable } from './ChannelClaimTable';

export const PublisherClaimsSettings = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customerId = user?.customerId ?? '';
  const [searchParams] = useSearchParams();

  const [openAddChannelClaimDialog, setOpenAddChannelClaimDialog] = useState(false);
  const toggleAddChannelClaimDialog = () => setOpenAddChannelClaimDialog(!openAddChannelClaimDialog);

  const channelClaimsQuery = useFetchChannelClaims('publisher');
  const channelClaims = channelClaimsQuery.data?.channelClaims;

  const channelClaimList =
    channelClaims && !!searchParams.get(ChannelClaimParams.ViewingOptions)
      ? filterChannelClaims(channelClaims, customerId)
      : channelClaims;

  return (
    <BackgroundDiv>
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
          heading: <Typography variant="h2" sx={{ mt: '1rem' }} />,
          button: (
            <Button
              data-testid={dataTestId.basicData.addChannelClaimButton}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ my: '0.5rem', textTransform: 'none' }}
              onClick={toggleAddChannelClaimDialog}>
              {t('editor.institution.channel_claims.add_publisher_channel_claim')}
            </Button>
          ),
        }}
      />

      <ChannelClaimContext.Provider
        value={{ refetchClaimedChannels: channelClaimsQuery.refetch, channelType: 'publisher' }}>
        <TableContainer aria-live="polite" aria-busy={channelClaimsQuery.isPending} sx={{ mt: '1rem' }}>
          {channelClaimsQuery.isPending ? (
            <PageSpinner aria-label={t('editor.institution.channel_claims.channel_claim')} />
          ) : channelClaimList && channelClaimList.length > 0 ? (
            <ChannelClaimTable channelClaimList={channelClaimList} canEdit />
          ) : null}
        </TableContainer>

        <AddChannelClaimDialog open={openAddChannelClaimDialog} closeDialog={toggleAddChannelClaimDialog} />
      </ChannelClaimContext.Provider>
    </BackgroundDiv>
  );
};
