import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useGetUrlFilteredInstitutionReports } from '../../../api/hooks/useGetUrlFilteredInstitutionReports';
import { PercentageWithIcon } from '../../../components/atoms/PercentageWithIcon';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { HorizontalBox, VerticalBox } from '../../../components/styled/Wrappers';
import i18n from '../../../translations/i18n';
import { InstitutionReport } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { formatNumber } from '../../../utils/general-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const [textExpanded, setTextExpanded] = useState(false);
  const detailsId = 'publication-points-details';
  const { filteredData, isPending, isError } = useGetUrlFilteredInstitutionReports();

  return (
    <NviStatusWrapper
      headline={t('basic_data.nvi.publication_points_status')}
      topView={
        <Box sx={{ mb: '1rem' }}>
          <Typography>{t('publication_points_description')}</Typography>
          <Button
            variant="text"
            onClick={() => setTextExpanded((prev) => !prev)}
            aria-expanded={textExpanded}
            aria-controls={detailsId}
            data-testid={dataTestId.basicData.nvi.publicationPointsExpandDescriptionButton}
            endIcon={textExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ textDecoration: 'underline', justifyContent: 'flex-start', p: 0, minWidth: 0, my: '0.5rem' }}>
            {textExpanded ? t('common.read_less') : t('common.read_more')}
          </Button>
          {
            <Typography id={detailsId} sx={{ display: textExpanded ? 'block' : 'none' }}>
              {t('publication_points_description_more')}
            </Typography>
          }
          <VerticalBox sx={{ gap: '0.5rem', mt: '1rem' }}>
            <Typography>
              <Trans
                i18nKey="x_results_are_ready_for_reporting_and_they_give_y_publication_points"
                values={{ num_results: formatNumber(14632), total_publicationpoints: formatNumber(20566) }}
                components={{ b: <strong /> }}
              />
            </Typography>
            <Typography>
              <Trans
                i18nKey="percent_of_published_reports_in_year"
                values={{ percentage: formatNumber(50.1), year: 2022 }}
                components={{ b: <strong /> }}
              />
            </Typography>
            <Typography>
              <Trans
                i18nKey="percent_of_publication_points_in_year"
                values={{ percentage: formatNumber(50.1), year: 2022 }}
                components={{ b: <strong /> }}
              />
            </Typography>
          </VerticalBox>
        </Box>
      }
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
                    <TableCell align="center">{byLocalApprovalStatus.approved}</TableCell>
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
