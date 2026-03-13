import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchNviPeriodReport } from '../api/hooks/useFetchNviPeriodReport';
import { dataTestId } from '../utils/dataTestIds';
import { formatNumber } from '../utils/general-helpers';
import { getDefaultNviYear } from '../utils/hooks/useNviCandidatesParams';
import { VerticalBox } from './styled/Wrappers';

export const AdminNviPublicationPointsTexts = () => {
  const { t } = useTranslation();
  const [textExpanded, setTextExpanded] = useState(false);
  const detailsId = 'publication-points-details';
  const year = getDefaultNviYear();
  const periodReport = useFetchNviPeriodReport({ year, hideErrorMessage: true });
  const periodReportLastYear = useFetchNviPeriodReport({ year: year - 1, hideErrorMessage: true });
  const periodTotals = periodReport.data?.totals;
  const periodTotalsLastYear = periodReportLastYear.data?.totals;

  return (
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
      <Typography id={detailsId} sx={{ display: textExpanded ? 'block' : 'none' }}>
        {t('publication_points_description_more')}
      </Typography>
      <VerticalBox sx={{ gap: '0.5rem', mt: '1rem' }}>
        {periodReport.isPending ? (
          <Skeleton sx={{ width: '50%' }} />
        ) : periodReport.isError || !periodTotals ? undefined : (
          <Typography>
            <Trans
              i18nKey="x_results_are_ready_for_reporting_and_they_give_y_publication_points"
              values={{
                num_results: formatNumber(periodTotals.undisputedTotalCount),
                total_publicationpoints: formatNumber(periodTotals.validPoints),
              }}
              components={{ b: <strong /> }}
            />
          </Typography>
        )}
        {periodReport.isPending || periodReportLastYear.isPending ? (
          <VerticalBox>
            <Skeleton sx={{ width: '40%' }} />
            <Skeleton sx={{ width: '40%' }} />
          </VerticalBox>
        ) : periodReport.isError ||
          periodReportLastYear.isError ||
          !periodTotals ||
          !periodTotalsLastYear ? undefined : (
          <>
            <Typography>
              <Trans
                i18nKey="percent_of_published_reports_in_year"
                values={{
                  percentage:
                    periodTotalsLastYear.undisputedTotalCount > 0
                      ? formatNumber(
                          Math.round(
                            (periodTotals.undisputedTotalCount / periodTotalsLastYear.undisputedTotalCount) * 100
                          )
                        )
                      : '-',
                  year: year - 1,
                }}
                components={{ b: <strong /> }}
              />
            </Typography>
            {/*<Typography>
              <Trans
                i18nKey="percent_of_publication_points_in_year"
                values={{
                  percentage:
                    periodTotalsLastYear.validPoints > 0
                      ? formatNumber(Math.round((periodTotals.validPoints / periodTotalsLastYear.validPoints) * 100))
                      : '-',
                  year: year - 1,
                }}
                components={{ b: <strong /> }}
              />
            </Typography>*/}
          </>
        )}
      </VerticalBox>
    </Box>
  );
};
