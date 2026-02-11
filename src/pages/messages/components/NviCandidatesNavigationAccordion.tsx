import AdjustIcon from '@mui/icons-material/Adjust';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { NviCandidateGlobalStatusEnum, NviCandidatesSearchParam, NviCandidateStatusEnum } from '../../../api/searchApi';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { NviReportProgressBar } from '../../../components/NviReportProgressBar';
import { SelectableButton } from '../../../components/SelectableButton';
import {
  HorizontalBox,
  MediumTypography,
  StyledNviStatusBox,
  StyledTicketSearchFormGroup,
  VerticalBox,
} from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviCandidatesSearchPath, UrlPathTemplate } from '../../../utils/urlPaths';
import { StyledSkeleton } from './NviStatusTableRowWrapper';

export const NviCandidatesNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);

  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;
  const isOnNviDisputePage = location.pathname === UrlPathTemplate.TasksNviDisputes;
  const isOnPublicationPointsPage = location.pathname === UrlPathTemplate.TasksPublicationPoints;

  const nviParams = useNviCandidatesParams();

  const nviAggregationsQuery = useFetchNviCandidates({
    enabled: isOnNviCandidatesPage || isOnNviStatusPage || isOnNviDisputePage || isOnPublicationPointsPage,
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
          <NviReportProgressBar
            completedPercentage={nviCompletedPercentage}
            completedCount={nviCandidatesCompleted}
            totalCount={nviCandidatesTotal}
            isPending={nviAggregationsQuery.isPending}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '0.5rem' }}>
            <VerticalBox sx={{ my: '0.5rem', gap: '0.15rem' }}>
              <HorizontalBox sx={{ gap: '0.25rem' }}>
                <HourglassEmptyIcon sx={{ fontSize: 'medium' }} />
                <MediumTypography>
                  {t('tasks.nvi.candidates_for_control')} (
                  {nviAggregationsQuery.isPending ? (
                    <StyledSkeleton sx={{ display: 'inline-flex' }} />
                  ) : (
                    (nviPendingCount ?? 0)
                  )}
                  )
                </MediumTypography>
              </HorizontalBox>
              <HorizontalBox sx={{ gap: '0.25rem' }}>
                <CheckIcon sx={{ fontSize: 'medium' }} />
                <MediumTypography>
                  {t('tasks.nvi.status.Approved')} (
                  {nviAggregationsQuery.isPending ? (
                    <StyledSkeleton sx={{ display: 'inline-flex' }} />
                  ) : (
                    (nviApprovedCount ?? 0)
                  )}
                  )
                </MediumTypography>
              </HorizontalBox>
              <HorizontalBox sx={{ gap: '0.25rem' }}>
                <CloseIcon sx={{ fontSize: 'medium' }} />
                <MediumTypography>
                  {t('tasks.nvi.status.Rejected')} (
                  {nviAggregationsQuery.isPending ? (
                    <StyledSkeleton sx={{ display: 'inline-flex' }} />
                  ) : (
                    (nviRejectedCount ?? 0)
                  )}
                  )
                </MediumTypography>
              </HorizontalBox>
            </VerticalBox>
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
            <SelectableButton
              data-testid={dataTestId.tasksPage.nvi.showDisputesButton}
              sx={{ justifyContent: 'center' }}
              isSelected={isOnNviDisputePage}
              to={{ pathname: UrlPathTemplate.TasksNviDisputes }}>
              {t('tasks.nvi.show_disputes')} (
              {nviAggregationsQuery.isPending ? (
                <Box sx={{ width: '1.5rem' }}>
                  <StyledSkeleton width={24} sx={{ display: 'inline-block' }} />
                </Box>
              ) : (
                (nviDisputeCount ?? 0)
              )}
              )
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.tasksPage.nvi.showPublicationPointsButton}
              sx={{ justifyContent: 'center' }}
              isSelected={isOnPublicationPointsPage}
              to={{ pathname: UrlPathTemplate.TasksPublicationPoints }}>
              {t('tasks.nvi.show_status_for_publication_points')}
            </SelectableButton>
          </Box>
        </StyledNviStatusBox>
      </StyledTicketSearchFormGroup>
    </NavigationListAccordion>
  );
};
