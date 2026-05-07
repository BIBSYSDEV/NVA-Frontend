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
import { useFetchCustomerMap } from '../../../../api/hooks/useFetchCustomerMap';
import { InstitutionContactInformationDialog } from '../../../../components/dialogs/institution-contact-information/InstitutionContactInformationDialog';
import { NviPageLayout } from '../../../../components/page-layouts/NviPageLayout';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { NviAdminSortSelectorType } from '../_utils/nvi-admin-sort-types';
import { VerticalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../components/tables/table-styles';
import { LanguageString } from '../../../../types/common.types';
import { InstitutionReport } from '../../../../types/nvi.types';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';
import { useInstitutionReportsFilteredAndSortedByUrl } from '../_hooks/useInstitutionReportsFilteredAndSortedByUrl';
import { NviAdminTableSortSelector } from '../_components/NviAdminTableSortSelector';
import { CenteredContactInformationCell, CenteredPercentageControlledCell } from '../_styles/nvi-admin-table-styles';
import { NviAdminReportingStatusRow } from './_components/NviAdminReportingStatusRow';
import { NviAdminReportingStatusTexts } from './_components/NviAdminReportingStatusTexts';

export const NviAdminReportingStatusPage = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const { sortedAndFilteredData, isPending, isError } = useInstitutionReportsFilteredAndSortedByUrl(year);
  const [selectedInstitution, setSelectedInstitution] = useState<{ id: string; labels: LanguageString } | undefined>();
  const { nvaCustomers, isFetchingCustomerMap } = useFetchCustomerMap();

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
                      {t('view_contact_point')}
                    </Box>
                  </CenteredContactInformationCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAndFilteredData.map((report: InstitutionReport) => (
                  <NviAdminReportingStatusRow
                    report={report}
                    key={report.id}
                    onClickContactInformation={setSelectedInstitution}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <InstitutionContactInformationDialog
            isOpen={selectedInstitution !== undefined}
            onClose={() => setSelectedInstitution(undefined)}
            isFetchingCustomers={isFetchingCustomerMap}
            id={nvaCustomers?.get(selectedInstitution?.id ?? '')?.id}
            institutionLabels={selectedInstitution?.labels}
          />
        </VerticalBox>
      )}
    </NviPageLayout>
  );
};
