import AdjustIcon from '@mui/icons-material/Adjust';
import { Box, Divider, LinearProgress, Skeleton, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { NviCandidateGlobalStatusEnum, NviCandidatesSearchParam, NviCandidateStatusEnum } from '../../../api/searchApi';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { SelectableButton } from '../../../components/SelectableButton';
import { StyledTicketSearchFormGroup } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviCandidatesSearchPath, UrlPathTemplate } from '../../../utils/urlPaths';

const StyledNviStatusBox = styled(Box)(({ theme }) => ({
  padding: '0.5rem',
  borderRadius: '0.25rem',
  backgroundColor: theme.palette.background.paper,
  marginBottom: '0.5rem',
}));

const StyledTypography = styled(Typography)({
  display: 'flex',
});

const StyledSkeleton = styled(Skeleton)({
  width: '2ch',
});

const progressLabel = 'progress-label';

export const NviCandidatesNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);

  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;

  const nviParams = useNviCandidatesParams();

  console.log('test');

  const nviAggregationsQuery = useFetchNviCandidates({
    enabled: isOnNviCandidatesPage || isOnNviStatusPage,
    params: { year: nviParams.year, size: 0, aggregation: 'all' },
  });

  const nviAggregations = nviAggregationsQuery.data?.aggregations;

  const nviPendingCount = nviAggregations?.pending.docCount.toLocaleString();
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
      startIcon={<AdjustIcon />}
      accordionPath={UrlPathTemplate.TasksNvi}
      defaultPath={getNviCandidatesSearchPath({
        username: user?.nvaUsername,
        status: NviCandidateStatusEnum.Pending,
        globalStatus: NviCandidateGlobalStatusEnum.Pending,
      })}
      dataTestId={dataTestId.tasksPage.nviAccordion}>
      <StyledTicketSearchFormGroup>
        <StyledNviStatusBox>
          <Typography fontWeight="bold">{t('tasks.nvi.nvi_reporting_status')}</Typography>
          {nviAggregationsQuery.isPending ? (
            <>
              <Skeleton />
              <Skeleton sx={{ maxWidth: '10rem' }} />
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <LinearProgress
                  aria-labelledby={progressLabel}
                  variant="determinate"
                  value={nviCompletedPercentage}
                  color="secondary"
                  sx={{
                    flexGrow: '1',
                    my: '0.175rem',
                    height: '1rem',
                    bgcolor: 'tertiary.main',
                    borderRadius: '0.5rem',
                  }}
                />
                <Typography>{nviCompletedPercentage}%</Typography>
              </Box>
              <Typography id={progressLabel} gutterBottom>
                {t('tasks.nvi.completed_count', {
                  completed: nviCandidatesCompleted,
                  total: nviCandidatesTotal,
                })}
              </Typography>
            </>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '0.5rem' }}>
            <SelectableButton
              data-testid={dataTestId.tasksPage.nvi.showCandidateSearchButton}
              sx={{ justifyContent: 'center' }}
              isSelected={isOnNviCandidatesPage}
              to={getNviCandidatesSearchPath({
                username: user?.nvaUsername,
                year: nviParams.year,
                status: NviCandidateStatusEnum.Pending,
                globalStatus: NviCandidateGlobalStatusEnum.Pending,
              })}>
              {t('tasks.nvi.show_candidate_search')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.tasksPage.nvi.showReportingStatusButton}
              sx={{ justifyContent: 'center' }}
              isSelected={isOnNviStatusPage}
              to={{
                pathname: UrlPathTemplate.TasksNviStatus,
                search: `?${NviCandidatesSearchParam.Year}=${nviParams.year}`,
              }}>
              {t('tasks.nvi.show_reporting_status')}
            </SelectableButton>
          </Box>
        </StyledNviStatusBox>

        <StyledNviStatusBox sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Typography fontWeight="bold">{t('tasks.nvi.nvi_reporting_status')}:</Typography>
          <StyledTypography>
            {t('tasks.nvi.candidates_for_control')} (
            {nviAggregationsQuery.isPending ? <StyledSkeleton /> : (nviPendingCount ?? 0)})
          </StyledTypography>
          <Divider sx={{ bgcolor: 'black' }} />
          <Typography fontWeight="bold">{t('tasks.nvi.controlled')}:</Typography>
          <StyledTypography>
            {t('tasks.nvi.status.Approved')} (
            {nviAggregationsQuery.isPending ? <StyledSkeleton /> : (nviApprovedCount ?? 0)})
          </StyledTypography>
          <StyledTypography>
            {t('tasks.nvi.status.Rejected')} (
            {nviAggregationsQuery.isPending ? <StyledSkeleton /> : (nviRejectedCount ?? 0)})
          </StyledTypography>
          <Divider sx={{ bgcolor: 'black' }} />
          <StyledTypography>
            {t('tasks.nvi.status.Dispute')} (
            {nviAggregationsQuery.isPending ? <StyledSkeleton /> : (nviDisputeCount ?? 0)})
          </StyledTypography>
        </StyledNviStatusBox>
      </StyledTicketSearchFormGroup>
    </NavigationListAccordion>
  );
};
