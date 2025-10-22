import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchFundingSources } from '../../../api/hooks/useFetchFundingSources';
import {
  fundingSourceIsNfr,
  getNfrProjectUrl,
} from '../../../pages/registration/description_tab/projects_field/projectHelpers';
import { Funding } from '../../../types/registration.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OpenInNewLink } from '../../OpenInNewLink';

interface FundingBoxProps {
  funding?: Funding;
}
export const FundingBox = ({ funding }: FundingBoxProps) => {
  const { t } = useTranslation();
  const fundingSourcesQuery = useFetchFundingSources();
  const fundingSourcesList = fundingSourcesQuery.data?.sources ?? [];

  if (!funding) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gap: '0.5rem',
        border: '1px solid grey',
        borderRadius: '4px',
        my: '0.5rem',
        p: '0.5rem',
        bgcolor: 'white',
      }}>
      <Typography fontWeight="bold">{t('registration.description.funding.funder')}:</Typography>
      {fundingSourcesQuery.isPending ? (
        <Skeleton />
      ) : (
        <Typography>
          {getLanguageString(fundingSourcesList.find((fundingSource) => fundingSource.id === funding.source)?.name)}
        </Typography>
      )}

      <Typography fontWeight="bold">{t('registration.description.funding.funding_id')}:</Typography>
      {fundingSourceIsNfr(funding.source) && funding.identifier ? (
        <OpenInNewLink href={getNfrProjectUrl(funding.identifier)}>{funding.identifier}</OpenInNewLink>
      ) : (
        <Typography>{funding.identifier}</Typography>
      )}

      <Typography fontWeight="bold">{t('registration.description.funding.funding_name')}:</Typography>
      <Typography>{getLanguageString(funding.labels)}</Typography>

      {funding.fundingAmount && (
        <>
          <Typography fontWeight="bold">{t('registration.description.funding.funding_sum')}:</Typography>
          <Typography>
            {funding.fundingAmount.currency} {funding.fundingAmount.amount}
          </Typography>
        </>
      )}
    </Box>
  );
};
