import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AdminNviPublicationPointsTexts } from '../../../../components/AdminNviPublicationPointsTexts';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import {
  NviAdminSortSelector,
  NviAdminSortSelectorType,
} from '../../../../components/sortSelectors/sortNviTable/NviAdminSortSelector';
import { HorizontalBox, VerticalBox } from '../../../../components/styled/Wrappers';
import { NviAdminPointsTableRow } from '../../../../components/tables/nviAdmin/NviAdminPointsTableRow';
import { useSortInstitutionReports } from '../../../../hooks/nvi/useSortInstitutionReports';
import { useUrlFilteredInstitutionReports } from '../../../../hooks/nvi/useUrlFilteredInstitutionReports';
import { CenteredTableCell } from '../../../../styles/tableStyles';
import { InstitutionReport } from '../../../../types/nvi.types';
import { NviPointsModalVariant, NviPointsQuestionIcon } from '../../../messages/components/NviPointsQuestionIcon';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const { filteredData, isPending, isError } = useUrlFilteredInstitutionReports();
  const sortedData = useSortInstitutionReports(filteredData);

  return (
    <NviStatusWrapper
      headline={t('basic_data.nvi.publication_points_status')}
      topView={<AdminNviPublicationPointsTexts />}
      yearSelector
      sectorSelector
      institutionSearch>
      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <Typography>{t('feedback.error.get_nvi_reports')}</Typography>
      ) : (
        <VerticalBox sx={{ width: '100%' }}>
          <NviAdminSortSelector type={NviAdminSortSelectorType.Points} />
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
                      <NviPointsQuestionIcon variant={NviPointsModalVariant.Admin} />
                    </HorizontalBox>
                  </CenteredTableCell>
                  <CenteredTableCell>{t('percentage_approved')}</CenteredTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((report: InstitutionReport) => (
                  <NviAdminPointsTableRow report={report} key={report.id} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </VerticalBox>
      )}
    </NviStatusWrapper>
  );
};
