import AdjustIcon from '@mui/icons-material/Adjust';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useFetchNviReportForInstitution } from '../../../api/hooks/useFetchNviReportForInstitution';
import { NviCandidateGlobalStatusEnum, NviCandidatesSearchParam, NviCandidateStatusEnum } from '../../../api/searchApi';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getDefaultNviYear, useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviCandidatesSearchPath, UrlPathTemplate } from '../../../utils/urlPaths';
import { NavigationListAccordion } from '../../NavigationListAccordion';
import { StyledSkeleton } from '../../nvi/table/rows/NviRowWrapper';
import { NviReportProgressBar } from '../../NviReportProgressBar';
import { SelectableButton } from '../../SelectableButton';
import {
  HorizontalBox,
  MediumTypography,
  StyledNviStatusBox,
  StyledTicketSearchFormGroup,
  VerticalBox,
} from '../../styled/Wrappers';

export const NviCandidatesNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);

  const isOnNviCandidatesPage = location.pathname === UrlPathTemplate.TasksNvi;
  const isOnNviStatusPage = location.pathname === UrlPathTemplate.TasksNviStatus;
  const isOnNviDisputePage = location.pathname === UrlPathTemplate.TasksNviDisputes;
  const isOnPublicationPointsPage = location.pathname === UrlPathTemplate.TasksPublicationPoints;

  const nviParams = useNviCandidatesParams();
  const year = nviParams.year ?? getDefaultNviYear();

  const nviReportsQuery = useFetchNviReportForInstitution({
    id: getIdentifierFromId(user?.topOrgCristinId ?? ''),
    year: Number(year), // HACK: awaiting refactor of typecasting
    enabled: isOnNviCandidatesPage || isOnNviStatusPage || isOnNviDisputePage || isOnPublicationPointsPage,
  });

  const byLocalApprovalStatus = nviReportsQuery.data?.institutionSummary.byLocalApprovalStatus;
  const totals = nviReportsQuery.data?.institutionSummary.totals;

  const nviNewCount = byLocalApprovalStatus?.new.toLocaleString();
  const nviPendingCount = byLocalApprovalStatus?.pending.toLocaleString();
  const nviApprovedCount = byLocalApprovalStatus?.approved.toLocaleString();
  const nviRejectedCount = byLocalApprovalStatus?.rejected.toLocaleString();
  const nviDisputeCount = totals?.disputedCount.toLocaleString();

  const nviCandidatesTotal = totals?.undisputedTotalCount ?? 0;
  const nviCandidatesCompleted = totals?.undisputedProcessedCount ?? 0;
  const nviCompletedPercentage =
    nviCandidatesTotal > 0 ? Math.floor((nviCandidatesCompleted / nviCandidatesTotal) * 100) : 100;

  return (
    <NavigationListAccordion
      title={t('tasks.nvi.nvi_control')}
      startIcon={<AdjustIcon />}
      accordionPath={UrlPathTemplate.TasksNvi}
      defaultPath={getNviCandidatesSearchPath({
        username: user?.nvaUsername,
        status: [NviCandidateStatusEnum.New, NviCandidateStatusEnum.Pending],
        globalStatus: NviCandidateGlobalStatusEnum.Pending,
      })}
      dataTestId={dataTestId.tasksPage.nviAccordion}>
      <StyledTicketSearchFormGroup>
        <StyledNviStatusBox>
          <NviReportProgressBar
            completedPercentage={nviCompletedPercentage}
            completedCount={nviCandidatesCompleted}
            totalCount={nviCandidatesTotal}
            isPending={nviReportsQuery.isPending}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '0.5rem' }}>
            <VerticalBox sx={{ my: '0.5rem', gap: '0.15rem' }}>
              <HorizontalBox sx={{ gap: '0.25rem' }}>
                <HourglassEmptyIcon sx={{ fontSize: 'medium' }} />
                <MediumTypography>
                  {t('tasks.nvi.candidates')} (
                  {nviReportsQuery.isPending ? <StyledSkeleton sx={{ display: 'inline-flex' }} /> : (nviNewCount ?? 0)})
                </MediumTypography>
              </HorizontalBox>
              <HorizontalBox sx={{ gap: '0.25rem' }}>
                <HourglassEmptyIcon sx={{ fontSize: 'medium' }} />
                <MediumTypography>
                  {t('controlling')} (
                  {nviReportsQuery.isPending ? (
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
                  {nviReportsQuery.isPending ? (
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
                  {nviReportsQuery.isPending ? (
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
                status: [NviCandidateStatusEnum.New, NviCandidateStatusEnum.Pending],
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
              {nviReportsQuery.isPending ? (
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
