import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetUrlFilteredInstitutionReports } from '../../../api/hooks/useGetUrlFilteredInstitutionReports';
import { useSortInstitutionReports } from '../../../api/hooks/useSortInstitutionReports';
import { AdminNviPublicationPointsTexts } from '../../../components/AdminNviPublicationPointsTexts';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { HorizontalBox, VerticalBox } from '../../../components/styled/Wrappers';
import { InstitutionReport } from '../../../types/nvi.types';
import { NviPointsModalVariant, NviPointsQuestionIcon } from '../../messages/components/NviPointsQuestionIcon';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';
import { NviAdminPublicationPointsRow } from './nviAdmin/NviAdminPublicationPointsRow';
import { NviAdminSortSelector, NviAdminSortSelectorType } from './nviAdmin/nviAdminSortSelector/NviAdminSortSelector';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const { filteredData, isPending, isError } = useGetUrlFilteredInstitutionReports();
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
                  <TableCell align="center">{t('candidates_approved_by_the_institution')}</TableCell>
                  <TableCell align="center">{t('candidates_others_must_approve')}</TableCell>
                  <TableCell align="center">{t('candidates_everyone_has_approved')}</TableCell>
                  <TableCell align="center">
                    <HorizontalBox sx={{ justifyContent: 'center' }}>
                      {t('points_for_reporting')}
                      <NviPointsQuestionIcon variant={NviPointsModalVariant.Admin} />
                    </HorizontalBox>
                  </TableCell>
                  <TableCell align="center">{t('percentage_approved')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((report: InstitutionReport) => (
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
