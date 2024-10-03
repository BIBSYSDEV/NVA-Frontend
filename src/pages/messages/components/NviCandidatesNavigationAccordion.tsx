import AdjustIcon from '@mui/icons-material/Adjust';
import {
  Box,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Link as MuiLink,
  Radio,
  Skeleton,
  styled,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { StyledTicketSearchFormGroup } from '../../../components/styled/Wrappers';
import { NviCandidateSearchStatus } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';

const StyledStatusRadio = styled(Radio)({
  paddingTop: '0.05rem',
  paddingBottom: '0.05rem',
});

const StyledNviStatusBox = styled(Box)({
  padding: '0.5rem',
  borderRadius: '0.25rem',
});

export const NviCandidatesNavigationAccordion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;

  const nviParams = useNviCandidatesParams();

  const setNviStatusParam = (newStatusFilter: NviCandidateSearchStatus) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    syncedParams.set(NviCandidatesSearchParam.Filter, newStatusFilter);
    if (nviParams.offset) {
      syncedParams.delete(NviCandidatesSearchParam.Offset);
    }
    navigate({ search: syncedParams.toString() });
  };

  const openCandidatesView = () => {
    if (!isOnNviCandidatesPage) {
      navigate({ pathname: UrlPathTemplate.TasksNvi, search: searchParams.toString() });
    }
  };

  const nviAggregationsQuery = useFetchNviCandidates({
    enabled: isOnNviCandidatesPage || isOnNviStatusPage,
    params: { ...nviParams, filter: null, size: 1, aggregation: 'all' },
  });

  const nviAggregations = nviAggregationsQuery.data?.aggregations;

  const nviPendingCount = nviAggregations?.pending.docCount.toLocaleString();
  const nviPendingCollaborationCount = nviAggregations?.pendingCollaboration.docCount.toLocaleString();
  const nviAssignedCount = nviAggregations?.assigned.docCount.toLocaleString();
  const nviAssignedCollaborationCount = nviAggregations?.assignedCollaboration.docCount.toLocaleString();
  const nviApprovedCount = nviAggregations?.approved.docCount.toLocaleString();
  const nviApprovedCollaborationCount = nviAggregations?.approvedCollaboration.docCount.toLocaleString();
  const nviRejectedCount = nviAggregations?.rejected.docCount.toLocaleString();
  const nviRejectedCollaborationCount = nviAggregations?.rejectedCollaboration.docCount.toLocaleString();
  const nviDisputeCount = nviAggregations?.dispute.docCount.toLocaleString();

  const nviCandidatesTotal = nviAggregations?.totalCount.docCount ?? 0;
  const nviCandidatesCompeted = nviAggregations?.completed.docCount ?? 0;
  const nviCompletedPercentage =
    nviCandidatesTotal > 0 ? Math.round((nviCandidatesCompeted / nviCandidatesTotal) * 100) : 100;

  return (
    <NavigationListAccordion
      title={t('common.nvi')}
      startIcon={<AdjustIcon sx={{ bgcolor: 'nvi.main' }} />}
      accordionPath={UrlPathTemplate.TasksNvi}
      dataTestId={dataTestId.tasksPage.nviAccordion}>
      <StyledTicketSearchFormGroup>
        <StyledNviStatusBox sx={{ bgcolor: 'nvi.light', mb: '1rem' }}>
          {nviAggregationsQuery.isPending ? (
            <>
              <Skeleton sx={{ maxWidth: '10rem' }} />
              <Skeleton />
              <Skeleton sx={{ maxWidth: '2rem', mx: 'auto' }} />
              <Skeleton sx={{ maxWidth: '8rem', mx: 'auto' }} />
            </>
          ) : (
            <>
              <Typography id="progress-label" gutterBottom>
                {t('tasks.nvi.completed_count', {
                  completed: nviCandidatesCompeted,
                  total: nviCandidatesTotal,
                })}
              </Typography>
              <LinearProgress
                aria-labelledby="progress-label"
                variant="determinate"
                value={nviCompletedPercentage}
                sx={{
                  my: '0.175rem',
                  height: '0.75rem',
                  bgcolor: 'white',
                }}
              />
              <Typography sx={{ textAlign: 'center' }}>{nviCompletedPercentage} %</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.5rem' }}>
                <MuiLink
                  data-testid={dataTestId.tasksPage.nvi.toggleStatusLink}
                  component={Link}
                  to={{
                    pathname: isOnNviCandidatesPage ? UrlPathTemplate.TasksNviStatus : UrlPathTemplate.TasksNvi,
                    search: `?${NviCandidatesSearchParam.Year}=${nviParams.year}`,
                  }}>
                  {isOnNviCandidatesPage ? t('tasks.nvi.show_reporting_status') : t('tasks.nvi.show_candidate_search')}
                </MuiLink>
              </Box>
            </>
          )}
        </StyledNviStatusBox>

        <FormLabel component="legend" sx={{ fontWeight: 700 }}>
          {t('tasks.status')}
        </FormLabel>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <StyledNviStatusBox sx={{ bgcolor: 'nvi.light' }}>
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.pendingRadio}
              checked={nviParams.filter === 'pending'}
              disabled={!!nviParams.assignee}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('pending')} />}
              slotProps={{ typography: { fontWeight: 700 } }}
              label={nviPendingCount ? `${t('tasks.nvi.status.New')} (${nviPendingCount})` : t('tasks.nvi.status.New')}
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.pendingCollaborationRadio}
              checked={nviParams.filter === 'pendingCollaboration'}
              disabled={!!nviParams.assignee}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('pendingCollaboration')} />}
              label={
                nviPendingCount
                  ? `${t('tasks.nvi.waiting_for_your_institution')} (${nviPendingCollaborationCount})`
                  : t('tasks.nvi.waiting_for_your_institution')
              }
            />
          </StyledNviStatusBox>

          <StyledNviStatusBox sx={{ bgcolor: 'nvi.light' }}>
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.assignedRadio}
              checked={nviParams.filter === 'assigned'}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('assigned')} />}
              slotProps={{ typography: { fontWeight: 700 } }}
              label={
                nviAssignedCount
                  ? `${t('tasks.nvi.status.Pending')} (${nviAssignedCount})`
                  : t('tasks.nvi.status.Pending')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.assignedCollaborationRadio}
              checked={nviParams.filter === 'assignedCollaboration'}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('assignedCollaboration')} />}
              label={
                nviAssignedCollaborationCount
                  ? `${t('tasks.nvi.waiting_for_your_institution')} (${nviAssignedCollaborationCount})`
                  : t('tasks.nvi.waiting_for_your_institution')
              }
            />
          </StyledNviStatusBox>

          <StyledNviStatusBox sx={{ bgcolor: 'secondary.main' }}>
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.approvedRadio}
              checked={nviParams.filter === 'approved'}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('approved')} />}
              slotProps={{ typography: { fontWeight: 700 } }}
              label={
                nviApprovedCount
                  ? `${t('tasks.nvi.status.Approved')} (${nviApprovedCount})`
                  : t('tasks.nvi.status.Approved')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.approvedCollaborationRadio}
              checked={nviParams.filter === 'approvedCollaboration'}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('approvedCollaboration')} />}
              label={
                nviApprovedCollaborationCount
                  ? `${t('tasks.nvi.waiting_for_other_institutions')} (${nviApprovedCollaborationCount})`
                  : t('tasks.nvi.waiting_for_other_institutions')
              }
            />
          </StyledNviStatusBox>

          <StyledNviStatusBox sx={{ bgcolor: 'secondary.main' }}>
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.rejectedRadio}
              checked={nviParams.filter === 'rejected'}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('rejected')} />}
              slotProps={{ typography: { fontWeight: 700 } }}
              label={
                nviRejectedCount
                  ? `${t('tasks.nvi.status.Rejected')} (${nviRejectedCount})`
                  : t('tasks.nvi.status.Rejected')
              }
            />
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.rejectedCollaborationRadio}
              checked={nviParams.filter === 'rejectedCollaboration'}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('rejectedCollaboration')} />}
              label={
                nviRejectedCollaborationCount
                  ? `${t('tasks.nvi.waiting_for_other_institutions')} (${nviRejectedCollaborationCount})`
                  : t('tasks.nvi.waiting_for_other_institutions')
              }
            />
          </StyledNviStatusBox>

          <StyledNviStatusBox sx={{ bgcolor: 'secondary.main' }}>
            <FormControlLabel
              data-testid={dataTestId.tasksPage.nvi.statusFilter.disputeRadio}
              checked={nviParams.filter === 'dispute'}
              onClick={openCandidatesView}
              control={<StyledStatusRadio onChange={() => setNviStatusParam('dispute')} />}
              slotProps={{ typography: { fontWeight: 700 } }}
              label={
                nviDisputeCount
                  ? `${t('tasks.nvi.status.Dispute')} (${nviDisputeCount})`
                  : t('tasks.nvi.status.Dispute')
              }
            />
          </StyledNviStatusBox>
        </Box>
      </StyledTicketSearchFormGroup>
    </NavigationListAccordion>
  );
};
