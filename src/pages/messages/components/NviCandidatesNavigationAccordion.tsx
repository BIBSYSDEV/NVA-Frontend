import AdjustIcon from '@mui/icons-material/Adjust';
import { Box, ButtonGroup, Divider, LinearProgress, Skeleton, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { SelectableButton } from '../../../components/SelectableButton';
import { StyledTicketSearchFormGroup } from '../../../components/styled/Wrappers';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { UrlPathTemplate } from '../../../utils/urlPaths';

const StyledNviStatusBox = styled(Box)(({ theme }) => ({
  padding: '0.5rem',
  borderRadius: '0.25rem',
  backgroundColor: theme.palette.secondary.main,
  marginBottom: '0.5rem',
}));

export const NviCandidatesNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;

  const nviParams = useNviCandidatesParams();

  const nviAggregationsQuery = useFetchNviCandidates({
    enabled: isOnNviCandidatesPage || isOnNviStatusPage,
    params: { ...nviParams, filter: null, size: 1, aggregation: 'all' },
  });

  const nviAggregations = nviAggregationsQuery.data?.aggregations;

  const nviApprovedCount = nviAggregations?.approved.docCount.toLocaleString();
  const nviRejectedCount = nviAggregations?.rejected.docCount.toLocaleString();
  const nviDisputeCount = nviAggregations?.dispute.docCount.toLocaleString();

  const nviCandidatesTotal = nviAggregations?.totalCount.docCount ?? 0;
  const nviCandidatesCompleted = nviAggregations?.completed.docCount ?? 0;
  const nviCompletedPercentage =
    nviCandidatesTotal > 0 ? Math.round((nviCandidatesCompleted / nviCandidatesTotal) * 100) : 100;

  return (
    <NavigationListAccordion
      title={t('tasks.nvi.nvi_control')}
      startIcon={<AdjustIcon sx={{ bgcolor: 'nvi.main' }} />}
      accordionPath={UrlPathTemplate.TasksNvi}
      dataTestId={dataTestId.tasksPage.nviAccordion}>
      <StyledTicketSearchFormGroup>
        <StyledNviStatusBox>
          {nviAggregationsQuery.isPending ? (
            <>
              <Skeleton sx={{ maxWidth: '10rem' }} />
              <Skeleton />
              <Skeleton sx={{ maxWidth: '2rem', mx: 'auto' }} />
              <Skeleton sx={{ maxWidth: '8rem', mx: 'auto' }} />
            </>
          ) : (
            <>
              <Typography fontWeight="bold">{t('tasks.nvi.nvi_reporting_status')}</Typography>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <LinearProgress
                  aria-labelledby="progress-label"
                  variant="determinate"
                  value={nviCompletedPercentage}
                  sx={{
                    flexGrow: '1',
                    my: '0.175rem',
                    height: '1rem',
                    bgcolor: 'white',
                    borderRadius: '0.5rem',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'info.main',
                    },
                  }}
                />
                <Typography sx={{ textAlign: 'center' }}>{nviCompletedPercentage}%</Typography>
              </Box>
              <Typography id="progress-label" gutterBottom>
                {t('tasks.nvi.completed_count', {
                  completed: nviCandidatesCompleted,
                  total: nviCandidatesTotal,
                })}
              </Typography>

              <ButtonGroup
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  mt: '0.5rem',
                }}>
                <SelectableButton
                  data-testid={dataTestId.tasksPage.nvi.showCandidateSearchButton}
                  sx={{ justifyContent: 'center' }}
                  isSelected={isOnNviCandidatesPage}
                  onClick={() => navigate(UrlPathTemplate.TasksNvi)}>
                  {t('tasks.nvi.show_candidate_search')}
                </SelectableButton>
                <SelectableButton
                  data-testid={dataTestId.tasksPage.nvi.showReportingStatusButton}
                  sx={{ justifyContent: 'center' }}
                  isSelected={isOnNviStatusPage}
                  onClick={() => navigate(UrlPathTemplate.TasksNviStatus)}>
                  {t('tasks.nvi.show_reporting_status')}
                </SelectableButton>
              </ButtonGroup>
            </>
          )}
        </StyledNviStatusBox>

        <StyledNviStatusBox sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Typography fontWeight="bold">{t('tasks.nvi.nvi_reporting_status')}:</Typography>
          <Typography>
            {t('tasks.nvi.candidates_for_control')} ({nviCandidatesTotal})
          </Typography>
          <Divider sx={{ bgcolor: 'black' }} />
          <Typography fontWeight="bold">{t('tasks.nvi.controlled')}:</Typography>
          <Typography>
            {t('tasks.nvi.status.Approved')} ({nviApprovedCount})
          </Typography>
          <Typography>
            {t('tasks.nvi.status.Rejected')} ({nviRejectedCount})
          </Typography>
          <Divider sx={{ bgcolor: 'black' }} />
          <Typography>
            {t('tasks.nvi.status.Dispute')} ({nviDisputeCount})
          </Typography>
        </StyledNviStatusBox>
      </StyledTicketSearchFormGroup>
    </NavigationListAccordion>
  );
};
