import { TableContainer, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { useFetchChannelClaims } from '../../api/hooks/useFetchChannelClaims';
import { ChannelClaimParams } from '../../api/searchApi';
import { PageSpinner } from '../../components/PageSpinner';
import { RootState } from '../../redux/store';
import { filterChannelClaims } from '../../utils/customer-helpers';
import { ChannelClaimFilter } from './ChannelClaimFilter';
import { ChannelClaimTable } from './ChannelClaimTable';

export const SerialPublicationClaimsOverview = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customerId = user?.customerId ?? '';

  const channelClaimsQuery = useFetchChannelClaims('serial-publication');
  const channelClaims = channelClaimsQuery.data?.channelClaims;

  const [searchParams] = useSearchParams();

  const channelClaimList =
    channelClaims && !!searchParams.get(ChannelClaimParams.ViewingOptions)
      ? filterChannelClaims(channelClaims, customerId)
      : channelClaims;

  return (
    <>
      <Typography variant="h1"> {t('editor.institution.channel_claims.serial_publication_claims_overview')}</Typography>

      <ChannelClaimFilter />
      <TableContainer aria-live="polite" aria-busy={channelClaimsQuery.isPending} sx={{ mt: '1rem' }}>
        {channelClaimsQuery.isPending ? (
          <PageSpinner aria-label={t('editor.institution.channel_claims.channel_claim')} />
        ) : channelClaimList && channelClaimList.length > 0 ? (
          <ChannelClaimTable channelClaimList={channelClaimList} channelType={'serial-publication'} />
        ) : null}
      </TableContainer>
    </>
  );
};
