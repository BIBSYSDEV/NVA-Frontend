import AdjustIcon from '@mui/icons-material/Adjust';
import { Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useFetchNviPeriodReport } from '../../api/hooks/useFetchNviPeriodReport';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { NviReportProgressBar } from '../../components/NviReportProgressBar';
import { LinkCreateButton, NavigationList } from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { NviAdminOrderBy } from '../../components/sort-selectors/sort-nvi-table/nvi-admin-sort-helpers';
import { StyledNviStatusBox } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { getDefaultNviYear } from '../../utils/hooks/useNviCandidatesParams';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const NviAdminNavigationAccordion = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const isAppAdmin = !!user?.customerId && user.isAppAdmin;
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const reportQuery = useFetchNviPeriodReport({
    year: getDefaultNviYear(),
    enabled: isAppAdmin,
    hideErrorMessage: true,
  });
  const periodTotals = reportQuery.data?.totals;

  return (
    <NavigationListAccordion
      title={t('common.nvi')}
      startIcon={<AdjustIcon sx={{ bgcolor: 'nvi.main' }} />}
      accordionPath={UrlPathTemplate.BasicDataNvi}
      dataTestId={dataTestId.basicData.nviPeriodsLink}>
      <NavigationList aria-label={t('common.nvi')}>
        <StyledNviStatusBox>
          {reportQuery.isError || !periodTotals ? undefined : (
            <NviReportProgressBar
              completedPercentage={
                periodTotals.undisputedTotalCount > 0
                  ? Math.floor((periodTotals.undisputedProcessedCount / periodTotals.undisputedTotalCount) * 100)
                  : 0
              }
              completedCount={periodTotals.undisputedProcessedCount}
              totalCount={periodTotals.undisputedTotalCount}
              isPending={reportQuery.isPending}
            />
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
            <SelectableButton
              data-testid={dataTestId.basicData.nviReportingPeriodsLink}
              isSelected={currentPath === UrlPathTemplate.BasicDataNvi}
              to={UrlPathTemplate.BasicDataNvi}>
              {t('basic_data.nvi.reporting_periods')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.basicData.nviStatusLink}
              isSelected={currentPath === UrlPathTemplate.BasicDataNviStatus}
              to={`${UrlPathTemplate.BasicDataNviStatus}?year=${getDefaultNviYear()}`}>
              {t('basic_data.nvi.show_reporting_status')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.basicData.nviPublicationPointsLink}
              isSelected={currentPath === UrlPathTemplate.BasicDataNviPublicationPoints}
              to={`${UrlPathTemplate.BasicDataNviPublicationPoints}?year=${getDefaultNviYear()}&orderBy=${NviAdminOrderBy.Institution}&sort=asc`}>
              {t('basic_data.nvi.show_publication_points_status')}
            </SelectableButton>
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
