import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Link,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchFundingSources } from '../../api/cristinApi';
import { Funding } from '../../types/registration.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { fundingSourceIsNfr, getNfrProjectUrl } from '../registration/description_tab/projects_field/projectHelpers';

interface PublicFundingsContentProps {
  fundings: Funding[];
}

export const PublicFundingsContent = ({ fundings }: PublicFundingsContentProps) => {
  const { t } = useTranslation();

  const fundingSourcesQuery = useQuery({
    queryKey: ['fundingSources'],
    queryFn: fetchFundingSources,
    meta: { errorMessage: t('feedback.error.get_funding_sources') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });
  const fundingSourcesList = fundingSourcesQuery.data?.sources ?? [];

  return (
    <div style={{ display: 'grid' }}>
      {/* grid-div over is to avoid un-managed overflow on small screens */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.financier')}</TableCell>
              <TableCell>{t('registration.description.funding.funding_name')}</TableCell>
              <TableCell>{t('registration.description.funding.funding_id')}</TableCell>
              <TableCell>{t('registration.description.funding.funding_sum')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fundings.map((funding) => (
              <TableRow key={funding.source + funding.identifier}>
                <TableCell>
                  {fundingSourcesQuery.isPending ? (
                    <Skeleton />
                  ) : (
                    <Typography>
                      {getLanguageString(
                        fundingSourcesList?.find((fundingSource) => fundingSource.id === funding.source)?.name
                      )}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography>{getLanguageString(funding.labels)}</Typography>
                </TableCell>
                <TableCell>
                  {fundingSourceIsNfr(funding.source) && funding.identifier ? (
                    <Link
                      href={getNfrProjectUrl(funding.identifier)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}>
                      {funding.identifier}
                      <OpenInNewIcon />
                    </Link>
                  ) : (
                    <Typography>{funding.identifier}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {!fundingSourceIsNfr(funding.source) && (
                    <Typography>
                      {funding.fundingAmount?.amount} {funding.fundingAmount?.currency}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
