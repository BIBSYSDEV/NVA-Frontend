import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetUrlFilteredInstitutionReports } from '../../../api/hooks/useGetUrlFilteredInstitutionReports';
import { AdminNviPublicationPointsTexts } from '../../../components/AdminNviPublicationPointsTexts';
import { PercentageWithIcon } from '../../../components/atoms/PercentageWithIcon';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { HorizontalBox } from '../../../components/styled/Wrappers';
import i18n from '../../../translations/i18n';
import { InstitutionReport } from '../../../types/nvi.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const { filteredData, isPending, isError } = useGetUrlFilteredInstitutionReports();

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
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
                <TableCell>{t('common.institution')}</TableCell>
                <TableCell>{t('sector')}</TableCell>
                <TableCell align="center">{t('approved')}</TableCell>
                <TableCell align="center">{t('publication_points')}</TableCell>
                <TableCell align="center">{t('percentage_controlled')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map(({ id, institution, sector, institutionSummary }: InstitutionReport) => {
                const { byLocalApprovalStatus, totals } = institutionSummary;
                const percentageControlled =
                  totals.undisputedTotalCount > 0
                    ? (byLocalApprovalStatus.approved + byLocalApprovalStatus.rejected) / totals.undisputedTotalCount
                    : 0;
                const sectorKey = `basic_data.institutions.sector_values.${sector}`;
                const sectorLabel = i18n.exists(sectorKey) ? t(sectorKey as any) : sector;

                return (
                  <TableRow key={id} sx={{ height: '4rem' }}>
                    <TableCell>{getLanguageString(institution.labels)}</TableCell>
                    <TableCell>{sectorLabel}</TableCell>
                    <TableCell align="center">{totals.undisputedProcessedCount}</TableCell>
                    <TableCell align="center">{totals.validPoints}</TableCell>
                    <TableCell align="center">
                      <HorizontalBox sx={{ justifyContent: 'center' }}>
                        <PercentageWithIcon
                          warningThresholdMinimum={30}
                          successThresholdMinimum={100}
                          displayPercentage={Math.round(percentageControlled * 100)}
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
      )}
    </NviStatusWrapper>
  );
};
