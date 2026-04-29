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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InstitutionContactInformationDialog } from '../../../../components/nvi/dialogs/InstitutionContactInformationDialog';
import { useInstitutionReportsFilteredAndSortedByUrl } from '../../../../components/nvi/hooks/useInstitutionReportsFilteredAndSortedByUrl';
import { NviPageLayout } from '../../../../components/nvi/NviPageLayout';
import {
  CenteredContactInformationCell,
  CenteredPercentageControlledCell,
} from '../../../../components/nvi/table/nvi-table-styles';
import { NviAdminTableSortSelector } from '../../../../components/nvi/table/NviAdminTableSortSelector';
import { NviAdminReportingStatusRow } from '../../../../components/nvi/table/rows/NviAdminReportingStatusRow';
import { NviAdminReportingStatusTexts } from '../../../../components/nvi/top-texts/NviAdminReportingStatusTexts';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { NviAdminSortSelectorType } from '../../../../components/sort-selectors/sort-nvi-table/nvi-admin-sort-types';
import { VerticalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../components/tables/table-styles';
import { InstitutionReport } from '../../../../types/nvi.types';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';

export const NviAdminReportingStatusPage = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const { sortedAndFilteredData, isPending, isError } = useInstitutionReportsFilteredAndSortedByUrl(year);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | undefined>();

  return (
    <NviPageLayout
      headline={t('basic_data.nvi.reporting_status')}
      topView={<NviAdminReportingStatusTexts />}
      yearSelector
      sectorSelector
      institutionSearch>
      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <Typography>{t('feedback.error.get_nvi_reports')}</Typography>
      ) : (
        <VerticalBox sx={{ width: '100%' }}>
          <NviAdminTableSortSelector type={NviAdminSortSelectorType.Status} />
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
                  <CenteredPercentageControlledCell>{t('percentage_controlled')}</CenteredPercentageControlledCell>
                  <CenteredContactInformationCell>
                    {/* INFO: Empty header cell to match contact info button column */}
                    <Box component="span" sx={visuallyHidden}>
                      {t('view_contact_info_short')}
                    </Box>
                  </CenteredContactInformationCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAndFilteredData.map((report: InstitutionReport) => (
                  <NviAdminReportingStatusRow
                    report={report}
                    key={report.id}
                    onClickContactInformation={setSelectedInstitutionId}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <InstitutionContactInformationDialog
            isOpen={selectedInstitutionId !== undefined}
            onClose={() => setSelectedInstitutionId(undefined)}
          />
        </VerticalBox>
      )}
    </NviPageLayout>
  );
};
