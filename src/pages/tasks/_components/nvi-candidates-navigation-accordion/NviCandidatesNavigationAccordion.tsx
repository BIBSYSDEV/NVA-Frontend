import AdjustIcon from '@mui/icons-material/Adjust';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { NavigationListAccordion } from '../../../../components/NavigationListAccordion';
import { NviReportNumbers } from '../../../../components/nvi-report-numbers/NviReportNumbers';
import { NviReportProgressBar } from '../../../../components/NviReportProgressBar';
import { StyledNviStatusBox, StyledTicketSearchFormGroup } from '../../../../components/styled/Wrappers';
import { NviSearchStatusEnum } from '../../../../types/nvi.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useLoggedInUser } from '../../../../utils/hooks/useLoggedInUser';
import { getDefaultNviYear } from '../../../../utils/hooks/useNviCandidatesParams';
import { useNviInstitutionReportSummary } from '../../../../utils/hooks/useNviInstitutionReportSummary';
import { checkWhichTasksPage } from '../../../../utils/location-helpers/check-which-tasks-page';
import { getNviCandidatesSearchPath, UrlPathTemplate } from '../../../../utils/urlPaths';
import { nviSearchStatusParams } from '../../../messages/nviUtils';
import { NviAccordionNavigationButtons } from './_components/NviAccordionNavigationButtons';

export const NviCandidatesNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useLoggedInUser();
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
        year: getDefaultNviYear(),
        ...nviSearchStatusParams[NviSearchStatusEnum.CandidatesForControl],
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
          <NviAccordionNavigationButtons reportsArePending={query.isPending} approvalStatusCounts={counts} />
        </StyledNviStatusBox>
      </StyledTicketSearchFormGroup>
    </NavigationListAccordion>
  );
};
