import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { MergeImportCandidate } from '../../components/merge_results/MergeImportCandidate';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { StyledPageWithSideMenu } from '../../components/side-menu-components/_utils/side-menu-styles';
import { SideNavHeader } from '../../components/side-menu-components/SideNavHeader';
import { SideMenu } from '../../components/side-menu-components/SideMenu';
import { dataTestId } from '../../utils/dataTestIds';
import { useLoggedInUser } from '../../utils/hooks/useLoggedInUser';
import { checkWhichBasicDataPage } from '../../utils/location-helpers/check-which-basic-data-page';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getSubUrl, UrlPathTemplate } from '../../utils/urlPaths';
import { checkUserRoles } from '../../utils/user-helpers';
import { AdminCustomerInstitutionsContainer } from '../basic_data/app_admin/AdminCustomerInstitutionsContainer';
import { CentralImportCandidateForm } from '../basic_data/app_admin/central_import/CentralImportCandidateForm';
import { CentralImportDuplicationCheckPage } from '../basic_data/app_admin/central_import/CentralImportDuplicationCheckPage';
import { CentralImportPage } from '../basic_data/app_admin/central_import/CentralImportPage';
import { ImportCandidatesMenuFilters } from '../basic_data/app_admin/central_import/ImportCandidatesMenuFilters';
import { AddEmployeePage } from '../basic_data/institution_admin/AddEmployeePage';
import { PersonRegisterPage } from '../basic_data/institution_admin/person_register/PersonRegisterPage';
import { PublisherClaimsSettings } from '../editor/PublisherClaimsSettings';
import { SerialPublicationClaimsSettings } from '../editor/SerialPublicationClaimsSettings';
import NotFound from '../errorpages/NotFound';
import { BasicDataBackToMenuButton } from './_components/BasicDataBackToMenuButton';
import { ChannelClaimAccordion } from './_components/ChannelClaimAccordion';
import { InstitutionsNavigationAccordion } from './_components/InstitutionsNavigationAccordion';
import { NviAdminNavigationAccordion } from './_components/NviAdminNavigationAccordion';
import { PersonRegisterNavigationAccordion } from './_components/PersonRegisterNavigationAccordion';
import { NviAdminPublicationPointsPage } from './nvi/publication-points/NviAdminPublicationPointsPage';
import { NviPeriodsPage } from './nvi/reporting-periods/NviPeriodsPage';
import { NviAdminReportingStatusPage } from './nvi/status/NviAdminReportingStatusPage';

const BasicDataPage = () => {
  const { t } = useTranslation();
  const user = useLoggedInUser();
  const location = useLocation();
  const { isInstitutionAdmin, isAppAdmin, isInternalImporter } = checkUserRoles(user);
  const { isOnCentralImportEditPage, isOnCentralImportMergePage, isOnACentralImportSubPage } = checkWhichBasicDataPage(
    location.pathname,
    location.search
  );

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        isVisible={!isOnACentralImportSubPage}
        backToSideMenuButton={
          // INFO: CentralImportEditPage and CentralImportMergePage are two levels deep, so for them we want to go back to the landing page of central import (one level back) instead of going back to the search
          <BasicDataBackToMenuButton recreateSearch={!isOnCentralImportEditPage && !isOnCentralImportMergePage} />
        }>
        <SideNavHeader icon={BusinessCenterIcon} text={t('basic_data.basic_data')} />
        {isInstitutionAdmin && <PersonRegisterNavigationAccordion />}
        {isAppAdmin && (
          <>
            <InstitutionsNavigationAccordion />
            <NviAdminNavigationAccordion />
            <ChannelClaimAccordion />
          </>
        )}
        {isInternalImporter && (
          <NavigationListAccordion
            title={t('basic_data.central_import.central_import')}
            startIcon={<FilterDramaIcon sx={{ bgcolor: 'centralImport.main' }} />}
            accordionPath={UrlPathTemplate.BasicDataCentralImport}
            dataTestId={dataTestId.basicData.centralImportAccordion}>
            <ImportCandidatesMenuFilters />
          </NavigationListAccordion>
        )}
      </SideMenu>

      <Outlet />

      <ErrorBoundary>
        <Routes>
          <Route
            path={UrlPathTemplate.Root}
            element={
              <PrivateRoute
                isAuthorized={isAppAdmin || isInstitutionAdmin || isInternalImporter}
                element={
                  isInstitutionAdmin ? (
                    <Navigate to={UrlPathTemplate.BasicDataPersonRegister} replace />
                  ) : isAppAdmin ? (
                    <Navigate to={UrlPathTemplate.BasicDataInstitutions} replace />
                  ) : (
                    <Navigate to={UrlPathTemplate.BasicDataCentralImport} replace />
                  )
                }
              />
            }
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataInstitutions, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<AdminCustomerInstitutionsContainer />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataCentralImport, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportPage />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataCentralImportCandidate, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportDuplicationCheckPage />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataCentralImportCandidateWizard, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportCandidateForm />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataCentralImportCandidateMerge, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<MergeImportCandidate />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataAddEmployee, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isInstitutionAdmin} element={<AddEmployeePage />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataPersonRegister, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isInstitutionAdmin} element={<PersonRegisterPage />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataNvi, UrlPathTemplate.BasicData, true)}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<NviPeriodsPage />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataNviStatus, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<NviAdminReportingStatusPage />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataNviPublicationPoints, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<NviAdminPublicationPointsPage />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataPublisherClaims, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<PublisherClaimsSettings />} />}
          />
          <Route
            path={getSubUrl(UrlPathTemplate.BasicDataSerialPublicationClaims, UrlPathTemplate.BasicData)}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<SerialPublicationClaimsSettings />} />}
          />

          <Route path={getSubUrl(UrlPathTemplate.BasicData, UrlPathTemplate.BasicData, true)} element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default BasicDataPage;
