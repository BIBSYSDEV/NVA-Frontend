import AdjustIcon from '@mui/icons-material/Adjust';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { checkWhichTasksPage } from '../../../utils/location-checkers';
import { getNviCandidatesSearchPath, UrlPathTemplate } from '../../../utils/urlPaths';
import { NavigationListAccordion } from '../../NavigationListAccordion';
import { NviReportProgressBar } from '../../NviReportProgressBar';
import { StyledNviStatusBox, StyledTicketSearchFormGroup } from '../../styled/Wrappers';
import { NviAccordionNavigationButtons } from './_components/NviAccordionNavigationButtons';
import { NviReportNumbers } from './_components/NviReportNumbers';
import { useNviInstitutionReportSummary } from './_hooks/useNviInstitutionReportSummary';

export const NviCandidatesNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);
  const { isOnAnyNviOverviewPage } = checkWhichTasksPage(location.pathname);

  const { query, counts, candidatesTotal, candidatesCompleted, completedPercentage } = useNviInstitutionReportSummary({
    enabled: isOnAnyNviOverviewPage,
  });

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
            completedPercentage={completedPercentage}
            completedCount={candidatesCompleted}
            totalCount={candidatesTotal}
            isPending={query.isPending}
          />
          <NviReportNumbers isLoading={query.isPending} numbers={counts} />
          <NviAccordionNavigationButtons nviReportsQuery={query} approvalStatusCounts={counts} />
        </StyledNviStatusBox>
      </StyledTicketSearchFormGroup>
    </NavigationListAccordion>
  );
};
