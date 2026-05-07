import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  NviPointsHelperTextModal,
  NviPointsModalVariant,
} from '../../../../components/dialogs/helper-texts/NviPointsHelperTextModal';
import { NviPageLayout } from '../../../../components/page-layouts/NviPageLayout';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { NviAdminSortSelectorType } from '../_utils/nvi-admin-sort-types';
import { HorizontalBox, VerticalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../components/tables/table-styles';
import { InstitutionReport } from '../../../../types/nvi.types';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';
import { useInstitutionReportsFilteredAndSortedByUrl } from '../_hooks/useInstitutionReportsFilteredAndSortedByUrl';
import { NviAdminTableSortSelector } from '../_components/NviAdminTableSortSelector';
import { CenteredPercentageControlledCell } from '../_styles/nvi-admin-table-styles';
import { NviAdminPublicationPointsRow } from './_components/NviAdminPublicationPointsRow';
import { NviAdminPublicationPointsTexts } from './_components/NviAdminPublicationPointsTexts';

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
                  <CenteredPercentageControlledCell>{t('percentage_approved')}</CenteredPercentageControlledCell>
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
