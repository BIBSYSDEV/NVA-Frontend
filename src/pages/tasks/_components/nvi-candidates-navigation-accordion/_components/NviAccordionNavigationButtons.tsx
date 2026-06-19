import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import {
  NviCandidateGlobalStatusEnum,
  NviCandidatesSearchParam,
  NviCandidateStatusEnum,
} from '../../../../../api/searchApi';
import { SelectableButton } from '../../../../../components/SelectableButton';
import { SkeletonLine } from '../../../../../components/skeletons/SkeletonLine';
import { VerticalBox } from '../../../../../components/styled/Wrappers';
import { RootState } from '../../../../../redux/store';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../../../utils/hooks/useNviCandidatesParams';
import { checkWhichTasksPage } from '../../../../../utils/location-helpers';
import { getNviCandidatesSearchPath, UrlPathTemplate } from '../../../../../utils/urlPaths';
import { NviApprovalStatusCounts } from '../_hooks/useNviInstitutionReportSummary';

interface NviAccordionNavigationButtonsProps {
  approvalStatusCounts: NviApprovalStatusCounts;
  reportsArePending: boolean;
}

export const NviAccordionNavigationButtons = ({
  reportsArePending,
  approvalStatusCounts,
}: NviAccordionNavigationButtonsProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);

  const nviParams = useNviCandidatesParams();
  const { isOnNviCandidatesPage, isOnNviStatusPage, isOnNviDisputesPage, isOnNviPublicationPointsPage } =
    checkWhichTasksPage(location.pathname);

  return (
    <VerticalBox sx={{ mt: '0.5rem', gap: '0.5rem' }}>
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
        isSelected={isOnNviDisputesPage}
        to={{ pathname: UrlPathTemplate.TasksNviDisputes }}>
        {t('tasks.nvi.show_disputes')} (
        {reportsArePending ? (
          <Box sx={{ width: '1.5rem' }}>
            <SkeletonLine width={24} sx={{ display: 'inline-block' }} />
          </Box>
        ) : (
          (approvalStatusCounts.dispute ?? 0)
        )}
        )
      </SelectableButton>
      <SelectableButton
        data-testid={dataTestId.tasksPage.nvi.showPublicationPointsButton}
        sx={{ justifyContent: 'center' }}
        isSelected={isOnNviPublicationPointsPage}
        to={{ pathname: UrlPathTemplate.TasksPublicationPoints }}>
        {t('tasks.nvi.show_status_for_publication_points')}
      </SelectableButton>
    </VerticalBox>
  );
};
