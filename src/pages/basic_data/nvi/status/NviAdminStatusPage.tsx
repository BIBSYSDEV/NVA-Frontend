import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useInstitutionReportsFilteredByUrl } from '../../../../hooks/nvi/useInstitutionReportsFilteredByUrl';
import { useInstitutionReportsSortedByUrl } from '../../../../hooks/nvi/useInstitutionReportsSortedByUrl';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { CenteredTableCell, VerticalBox } from '../../../../components/styled/Wrappers';
import { InstitutionReport } from '../../../../types/nvi.types';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';
import {
  NviAdminSortSelector,
  NviAdminSortSelectorType,
} from '../../app_admin/nviAdmin/nviAdminSortSelector/NviAdminSortSelector';
import { NviAdminStatusPageRow } from '../../app_admin/nviAdmin/NviAdminStatusPageRow';

export const NviAdminStatusPage = () => {
  const { t } = useTranslation();
  const { filteredData, isPending, isError } = useInstitutionReportsFilteredByUrl();
  const sortedData = useInstitutionReportsSortedByUrl(filteredData);

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
      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <Typography>{t('feedback.error.get_nvi_reports')}</Typography>
      ) : (
        <VerticalBox sx={{ width: '100%' }}>
          <NviAdminSortSelector type={NviAdminSortSelectorType.Status} />
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
                  <TableCell sx={{ width: '30%' }}>{t('common.institution')}</TableCell>
                  <TableCell sx={{ width: '20%' }}>{t('sector')}</TableCell>
                  <CenteredTableCell>{t('candidate')}</CenteredTableCell>
                  <CenteredTableCell>{t('controlling')}</CenteredTableCell>
                  <CenteredTableCell>{t('approved')}</CenteredTableCell>
                  <CenteredTableCell>{t('rejected')}</CenteredTableCell>
                  <CenteredTableCell>{t('disputes')}</CenteredTableCell>
                  <CenteredTableCell>{t('common.total_number')}</CenteredTableCell>
                  <CenteredTableCell>{t('percentage_controlled')}</CenteredTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((report: InstitutionReport) => (
                  <NviAdminStatusPageRow report={report} key={report.id} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </VerticalBox>
      )}
    </NviStatusWrapper>
  );
};
