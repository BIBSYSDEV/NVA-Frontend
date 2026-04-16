import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NviAdminPublicationPointsRow } from '../../../../components/nvi/table/NviAdminPublicationPointsRow';
import { NviPublicationPointsTexts } from '../../../../components/nvi/top-view-texts/NviPublicationPointsTexts';

import { NviTopTextViewVariant } from '../../../../components/nvi/top-view-texts/top-text-types';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { NviAdminSortSelectorType } from '../../../../components/sort-selectors/sort-nvi-table/nvi-admin-sort-types';
import { HorizontalBox, VerticalBox } from '../../../../components/styled/Wrappers';
import { useInstitutionReportsFilteredAndSortedByUrl } from '../../../../hooks/nvi/useInstitutionReportsFilteredAndSortedByUrl';
import { useNviAdminPeriodReportNumbers } from '../../../../hooks/nvi/useNviAdminPeriodReportNumbers';
import { CenteredTableCell } from '../../../../styles/table-styles';
import { InstitutionReport } from '../../../../types/nvi.types';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';
import { NviPointsModalVariant, NviPointsQuestionIcon } from '../../../messages/components/NviPointsQuestionIcon';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';
import { NviAdminSortSelector } from '../../../basic_data/app_admin/nviAdmin/nviAdminSortSelector/NviAdminSortSelector';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const { sortedAndFilteredData, isPending, isError } = useInstitutionReportsFilteredAndSortedByUrl();
  const { year } = useNviCandidatesParams();
  const {
    validPoints,
    totalCount,
    percentageComparedToYearBefore,
    isPending: isInstitutionReportPending,
    isError: isInstitutionReportError,
  } = useNviAdminPeriodReportNumbers(year);

  return (
    <NviStatusWrapper
      headline={t('basic_data.nvi.publication_points_status')}
      topView={
        <NviPublicationPointsTexts
          variant={NviTopTextViewVariant.Admin}
          isPending={isInstitutionReportPending}
          isError={isInstitutionReportError}
          numbers={
            totalCount !== undefined && validPoints !== undefined && percentageComparedToYearBefore !== undefined
              ? { totalCount, validPoints, percentageComparedToYearBefore, yearBefore: year - 1 }
              : undefined
          }
        />
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
