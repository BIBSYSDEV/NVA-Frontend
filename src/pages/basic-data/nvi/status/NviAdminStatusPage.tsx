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
import { visuallyHidden } from '@mui/utils';
import { Trans, useTranslation } from 'react-i18next';
import { NviAdminSortSelectorType } from '../../../../components/sort-selectors/sort-nvi-table/nvi-admin-sort-types';
import { useInstitutionReportsFilteredAndSortedByUrl } from '../../../../hooks/nvi/useInstitutionReportsFilteredAndSortedByUrl';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { VerticalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../styles/table-styles';
import { InstitutionReport } from '../../../../types/nvi.types';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';
import { NviAdminSortSelector } from '../../../basic_data/app_admin/nviAdmin/nviAdminSortSelector/NviAdminSortSelector';
import { NviAdminStatusPageRow } from '../../../basic_data/app_admin/nviAdmin/NviAdminStatusPageRow';

export const NviAdminStatusPage = () => {
  const { t } = useTranslation();
  const { sortedAndFilteredData, isPending, isError } = useInstitutionReportsFilteredAndSortedByUrl();

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
                  <TableCell>
                    {/* This cell is hidden to make the number of cells in the table header the same as in the table row, where we display a button for displaying contact information */}
                    <Box component="span" sx={visuallyHidden}>
                      {t('view_contact_info_short')}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAndFilteredData.map((report: InstitutionReport) => (
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
