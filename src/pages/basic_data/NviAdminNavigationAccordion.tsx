import AdjustIcon from '@mui/icons-material/Adjust';
import { Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useFetchNviReportForInstitution } from '../../api/hooks/useFetchNviReportForInstitution';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { NviReportProgressBar } from '../../components/NviReportProgressBar';
import { LinkCreateButton, NavigationList } from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { StyledNviStatusBox } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getDefaultNviYear } from '../../utils/hooks/useNviCandidatesParams';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const NviAdminNavigationAccordion = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const topOrgId = user?.topOrgCristinId ? getIdentifierFromId(user.topOrgCristinId) : '';
  const reportQuery = useFetchNviReportForInstitution({
    year: getDefaultNviYear(),
    id: topOrgId,
  });
  const nviNumbers = reportQuery.data?.institutionSummary.totals;

  return (
    <NavigationListAccordion
      title={t('common.nvi')}
      startIcon={<AdjustIcon sx={{ bgcolor: 'nvi.main' }} />}
      accordionPath={UrlPathTemplate.BasicDataNvi}
      dataTestId={dataTestId.basicData.nviPeriodsLink}>
      <NavigationList aria-label={t('common.nvi')}>
        <StyledNviStatusBox>
          <BetaFunctionality>
            {reportQuery.isError || !nviNumbers ? undefined : (
              <NviReportProgressBar
                completedPercentage={
                  nviNumbers.undisputedTotalCount > 0
                    ? Math.round((nviNumbers.undisputedProcessedCount / nviNumbers.undisputedTotalCount) * 100)
                    : 0
                }
                completedCount={nviNumbers.undisputedProcessedCount}
                totalCount={nviNumbers.undisputedTotalCount}
                isPending={reportQuery.isPending}
              />
            )}
          </BetaFunctionality>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
            <SelectableButton
              data-testid={dataTestId.basicData.nviReportingPeriodsLink}
              isSelected={currentPath === UrlPathTemplate.BasicDataNvi}
              to={UrlPathTemplate.BasicDataNvi}>
              {t('basic_data.nvi.reporting_periods')}
            </SelectableButton>
            <BetaFunctionality sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <SelectableButton
                data-testid={dataTestId.basicData.nviStatusLink}
                isSelected={currentPath === UrlPathTemplate.BasicDataNviStatus}
                to={`${UrlPathTemplate.BasicDataNviStatus}?year=${getDefaultNviYear()}`}>
                {t('basic_data.nvi.show_reporting_status')}
              </SelectableButton>
              <SelectableButton
                data-testid={dataTestId.basicData.nviPublicationPointsLink}
                isSelected={currentPath === UrlPathTemplate.BasicDataNviPublicationPoints}
                to={`${UrlPathTemplate.BasicDataNviPublicationPoints}?year=${getDefaultNviYear()}`}>
                {t('basic_data.nvi.show_publication_points_status')}
              </SelectableButton>
            </BetaFunctionality>
          </Box>
        </StyledNviStatusBox>
      </NavigationList>

      <Divider sx={{ mt: '0.5rem' }} />
      <LinkCreateButton
        data-testid={dataTestId.basicData.addNviPeriodLink}
        isSelected={currentPath === UrlPathTemplate.BasicDataNviNew}
        selectedColor="nvi.main"
        to={UrlPathTemplate.BasicDataNviNew}
        title={t('basic_data.nvi.add_reporting_period')}
      />
    </NavigationListAccordion>
  );
};
