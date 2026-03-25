import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetUrlFilteredInstitutionReports } from '../../../../api/hooks/useGetUrlFilteredInstitutionReports';
import { useSortInstitutionReports } from '../../../../api/hooks/useSortInstitutionReports';
import { AdminNviPublicationPointsTexts } from '../../../../components/AdminNviPublicationPointsTexts';
import { PercentageWithIcon } from '../../../../components/atoms/PercentageWithIcon';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { HorizontalBox, VerticalBox } from '../../../../components/styled/Wrappers';
import { InstitutionReport } from '../../../../types/nvi.types';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';
import {
  getNviApprovedByEverybody,
  getNviApprovedByInstitution,
  getNviInstitutionName,
  getNviSectorLabel,
  getNviValidPoints,
  NviAdminSortSelectorType,
} from './nviAdminHelpers';
import { NviAdminSortSelector } from './nviAdminSortSelector/NviAdminSortSelector';

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
                <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
                  <TableCell>{t('common.institution')}</TableCell>
                  <TableCell>{t('sector')}</TableCell>
                  <TableCell>{t('candidates_approved_by_the_institution')}</TableCell>
                  <TableCell>{t('candidates_everyone_has_approved')}</TableCell>
                  <TableCell>{t('points_for_reporting')}</TableCell>
                  <TableCell>{t('percentage_approved')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((report: InstitutionReport) => {
                  const { id, institutionSummary } = report;
                  const { totals } = institutionSummary;
                  const approvedByEverybody = getNviApprovedByEverybody(report);
                  const undesputedTotals = totals.undisputedTotalCount;
                  const percentageControlled = undesputedTotals > 0 ? approvedByEverybody / undesputedTotals : 0;
                  const sectorLabel = getNviSectorLabel(report, t);

                  return (
                    <TableRow key={id} sx={{ height: '4rem' }}>
                      <TableCell>{getNviInstitutionName(report)}</TableCell>
                      <TableCell>{sectorLabel}</TableCell>
                      <TableCell align="center">{getNviApprovedByInstitution(report)}</TableCell>
                      <TableCell align="center">{approvedByEverybody}</TableCell>
                      <TableCell align="center">{getNviValidPoints(report)}</TableCell>
                      <TableCell>
                        <HorizontalBox sx={{ justifyContent: 'center' }}>
                          <PercentageWithIcon
                            displayPercentage={Math.floor(percentageControlled * 100)}
                            alternativeIfZero={'-'}
                          />
                        </HorizontalBox>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </VerticalBox>
      )}
    </NviStatusWrapper>
  );
};
