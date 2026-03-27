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
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import {
  NviAdminSortSelector,
  NviAdminSortSelectorType,
} from '../../../../components/sortSelectors/sortNviTable/NviAdminSortSelector';
import { VerticalBox } from '../../../../components/styled/Wrappers';
import { NviAdminStatusTableRow } from '../../../../components/tables/nviAdmin/NviAdminStatusTableRow';
import { useSortInstitutionReports } from '../../../../hooks/nvi/useSortInstitutionReports';
import { useUrlFilteredInstitutionReports } from '../../../../hooks/nvi/useUrlFilteredInstitutionReports';
import { CenteredTableCell } from '../../../../styles/tableStyles';
import { InstitutionReport } from '../../../../types/nvi.types';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';

export const NviAdminStatusPage = () => {
  const { t } = useTranslation();
  const { filteredData, isPending, isError } = useUrlFilteredInstitutionReports();
  const sortedData = useSortInstitutionReports(filteredData);

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
                  <NviAdminStatusTableRow report={report} key={report.id} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </VerticalBox>
      )}
    </NviStatusWrapper>
  );
};
