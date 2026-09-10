import AdjustIcon from '@mui/icons-material/Adjust';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { SelectableButton } from '../../../components/buttons/SelectableButton';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { NviReportNumbers } from '../../../components/nvi-report-numbers/NviReportNumbers';
import { NviReportProgressBar } from '../../../components/NviReportProgressBar';
import { StyledNviStatusBox, StyledTicketSearchFormGroup, VerticalBox } from '../../../components/styled/Wrappers';
import { dataTestId } from '../../../utils/dataTestIds';
import { getDefaultNviYear } from '../../../utils/hooks/useNviCandidatesParams';
import { useNviInstitutionReportSummary } from '../../../utils/hooks/useNviInstitutionReportSummary';
import { UrlPathTemplate } from '../../../utils/urlPaths';

const nviPublicationPointsDefaultPath = `${UrlPathTemplate.InstitutionNviPublicationPoints}?year=${getDefaultNviYear()}`;
const nviReportingStatusDefaultPath = `${UrlPathTemplate.InstitutionNviReportingStatus}?year=${getDefaultNviYear()}`;

export const NviInstitutionNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash

  const isOnNviPublicationPointsPage = currentPath.startsWith(UrlPathTemplate.InstitutionNviPublicationPoints);
  const isOnNviReportingStatusPage = currentPath.startsWith(UrlPathTemplate.InstitutionNviReportingStatus);

  const { query, counts, candidatesTotal, candidatesCompleted, completedPercentage } = useNviInstitutionReportSummary({
    enabled: isOnNviPublicationPointsPage || isOnNviReportingStatusPage,
  });

  return (
    <NavigationListAccordion
      title={t('common.nvi')}
      startIcon={<AdjustIcon />}
      accordionPath={UrlPathTemplate.InstitutionNviPublicationPoints}
      defaultPath={nviPublicationPointsDefaultPath}
      expanded={isOnNviPublicationPointsPage || isOnNviReportingStatusPage}
      dataTestId={dataTestId.editor.nviAccordion}>
      <StyledTicketSearchFormGroup>
        <StyledNviStatusBox>
          <NviReportProgressBar
            completedPercentage={completedPercentage}
            completedCount={candidatesCompleted}
            totalCount={candidatesTotal}
            isPending={query.isPending}
          />
          <NviReportNumbers isLoading={query.isPending} numbers={counts} />
          <VerticalBox sx={{ gap: '0.5rem', mt: '1rem' }}>
            <SelectableButton
              data-testid={dataTestId.editor.nviPublicationPointsLinkButton}
              isSelected={currentPath === UrlPathTemplate.InstitutionNviPublicationPoints}
              to={nviPublicationPointsDefaultPath}>
              {t('basic_data.nvi.show_publication_points_status')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.editor.nviReportingStatusLinkButton}
              isSelected={currentPath === UrlPathTemplate.InstitutionNviReportingStatus}
              to={nviReportingStatusDefaultPath}>
              {t('basic_data.nvi.show_reporting_status')}
            </SelectableButton>
          </VerticalBox>
        </StyledNviStatusBox>
      </StyledTicketSearchFormGroup>
    </NavigationListAccordion>
  );
};
