import {
  Box,
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
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useFetchNviReports } from '../../../api/hooks/useFetchNviReports';
import { PercentageWithIcon } from '../../../components/atoms/PercentageWithIcon';
import { HorizontalBox, VerticalBox } from '../../../components/styled/Wrappers';
import { InstitutionReport } from '../../../types/nvi.types';
import { getDefaultNviYear } from '../../../utils/hooks/useNviCandidatesParams';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';

export const NviAdminStatusPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const selectedSector = searchParams.get('sector');
  const institutionSearch = searchParams.get('institution');
  const reportsQuery = useFetchNviReports({ year: searchParams.get('year') ?? getDefaultNviYear().toString() });

  const filteredData = (reportsQuery.data?.institutions ? [...reportsQuery.data?.institutions] : [])
    .filter((report: InstitutionReport) => selectedSector === null || report.sector === selectedSector)
    .filter((report: InstitutionReport) => {
      if (institutionSearch === null) return true;
      const trimmedSearch = institutionSearch.trim().toLowerCase();
      const trimmedInstitution = report.institution.labels['nb'].trim().toLowerCase(); // TODO: Håndter språk på denne og den i tabellen
      return trimmedInstitution.includes(trimmedSearch);
    });

  return (
    <NviStatusWrapper
      headline={t('basic_data.nvi.reporting_status')}
      topView={
        <Box sx={{ mb: '1rem' }}>
          <Trans
            t={t}
            i18nKey="basic_data.nvi.reporting_status_description"
            components={{ p: <Typography gutterBottom /> }}
          />
        </Box>
      }
      yearSelector
      sectorSelector
      institutionSearch>
      {reportsQuery.data ? (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
                <TableCell>{t('common.institution')}</TableCell>
                <TableCell>{t('sector')}</TableCell>
                <TableCell>{t('candidate')}</TableCell>
                <TableCell>{t('controlling')}</TableCell>
                <TableCell>{t('approved')}</TableCell>
                <TableCell>{t('rejected')}</TableCell>
                <TableCell>{t('disputes')}</TableCell>
                <TableCell>{t('common.total_number')}</TableCell>
                <TableCell>{t('percentage_controlled')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map(({ id, institution, sector, institutionSummary }: InstitutionReport) => {
                const { byLocalApprovalStatus, totals } = institutionSummary;
                const percentageControlled =
                  totals.undisputedTotalCount > 0
                    ? (byLocalApprovalStatus.approved + byLocalApprovalStatus.rejected) / totals.undisputedTotalCount
                    : 0;
                const sectorKey = `basic_data.institutions.sector_values.${sector}`;
                const sectorLabel = i18n.exists(sectorKey) ? t(sectorKey as any) : sector;

                return (
                  <TableRow key={id} sx={{ height: '4rem' }}>
                    <TableCell>{institution.labels['nb']}</TableCell>
                    <TableCell>{sectorLabel}</TableCell>
                    <TableCell align="center">{byLocalApprovalStatus.new}</TableCell>
                    <TableCell align="center">{byLocalApprovalStatus.pending}</TableCell>
                    <TableCell align="center">{byLocalApprovalStatus.approved}</TableCell>
                    <TableCell align="center">{byLocalApprovalStatus.rejected}</TableCell>
                    <TableCell align="center">{totals.disputedCount}</TableCell>
                    <TableCell align="center">{totals.undisputedTotalCount}</TableCell>
                    <TableCell align="center">
                      <HorizontalBox sx={{ justifyContent: 'center' }}>
                        <PercentageWithIcon
                          warningThresholdMinimum={30}
                          successThresholdMinimum={100}
                          displayPercentage={Math.round(percentageControlled * 100)}
                          alternativeIfZero={'-'}
                        />
                      </HorizontalBox>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <VerticalBox sx={{ width: '100%' }}>
          <Skeleton sx={{ width: '100%', height: '5rem' }} />
          <Skeleton sx={{ width: '100%', height: '5rem' }} />
          <Skeleton sx={{ width: '100%', height: '5rem' }} />
        </VerticalBox>
      )}
    </NviStatusWrapper>
  );
};
