import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NviPageLayout } from '../../../../components/nvi/NviPageLayout';
import {
  NviPointsHelperTextModal,
  NviPointsModalVariant,
} from '../../../../components/nvi/table/helper-text-modals/NviPointsHelperTextModal';
import { NviAdminTableSortSelector } from '../../../../components/nvi/table/NviAdminTableSortSelector';
import { NviAdminPublicationPointsRow } from '../../../../components/nvi/table/rows/NviAdminPublicationPointsRow';
import { NviAdminPublicationPointsTexts } from '../../../../components/nvi/top-texts/NviAdminPublicationPointsTexts';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { NviAdminSortSelectorType } from '../../../../components/sort-selectors/sort-nvi-table/nvi-admin-sort-types';
import { HorizontalBox, VerticalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../components/tables/table-styles';
import { useInstitutionReportsFilteredAndSortedByUrl } from '../../../../hooks/nvi/useInstitutionReportsFilteredAndSortedByUrl';
import { InstitutionReport } from '../../../../types/nvi.types';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const { sortedAndFilteredData, isPending, isError } = useInstitutionReportsFilteredAndSortedByUrl(year);

  return (
    <NviPageLayout
      headline={t('basic_data.nvi.publication_points_status')}
      topView={<NviAdminPublicationPointsTexts />}
      yearSelector
      exportPublicationPoints
      sectorSelector
      institutionSearch>
      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <Typography>{t('feedback.error.get_nvi_reports')}</Typography>
      ) : (
        <VerticalBox sx={{ width: '100%' }}>
          <NviAdminTableSortSelector type={NviAdminSortSelectorType.Points} />
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'white' }}>
                  <TableCell sx={{ width: '30%' }}>{t('common.institution')}</TableCell>
                  <TableCell sx={{ width: '20%' }}>{t('sector')}</TableCell>
                  <CenteredTableCell>{t('candidates_approved_by_the_institution')}</CenteredTableCell>
                  <CenteredTableCell>{t('candidates_others_must_approve')}</CenteredTableCell>
                  <CenteredTableCell>{t('candidates_everyone_has_approved')}</CenteredTableCell>
                  <CenteredTableCell>
                    <HorizontalBox sx={{ justifyContent: 'center' }}>
                      {t('points_for_reporting')}
                      <NviPointsHelperTextModal variant={NviPointsModalVariant.Admin} />
                    </HorizontalBox>
                  </CenteredTableCell>
                  <CenteredTableCell>{t('percentage_approved')}</CenteredTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAndFilteredData.map((report: InstitutionReport) => (
                  <NviAdminPublicationPointsRow report={report} key={report.id} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </VerticalBox>
      )}
    </NviPageLayout>
  );
};
