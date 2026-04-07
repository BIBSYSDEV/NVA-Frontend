import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NviAdminSortSelectorType } from '../../../../components/sortSelectors/sortNviTable/nviAdminSortTypes';
import { useInstitutionReportsFilteredAndSortedByUrl } from '../../../../hooks/nvi/useInstitutionReportsFilteredAndSortedByUrl';
import { AdminNviPublicationPointsTexts } from '../../../../components/AdminNviPublicationPointsTexts';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { HorizontalBox, VerticalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../styles/tableStyles';
import { InstitutionReport } from '../../../../types/nvi.types';
import { NviPointsModalVariant, NviPointsQuestionIcon } from '../../../messages/components/NviPointsQuestionIcon';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';
import { NviAdminPublicationPointsRow } from '../../app_admin/nviAdmin/NviAdminPublicationPointsRow';
import { NviAdminSortSelector } from '../../app_admin/nviAdmin/nviAdminSortSelector/NviAdminSortSelector';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const { sortedAndFilteredData, isPending, isError } = useInstitutionReportsFilteredAndSortedByUrl();

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
                {sortedAndFilteredData.map((report: InstitutionReport) => (
                  <NviAdminPublicationPointsRow report={report} key={report.id} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </VerticalBox>
      )}
    </NviStatusWrapper>
  );
};
