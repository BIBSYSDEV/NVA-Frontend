import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AdjustIcon from '@mui/icons-material/Adjust';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import PeopleIcon from '@mui/icons-material/People';
import { Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import {
  LinkCreateButton,
  NavigationList,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { MinimizedMenuIconButton, SideMenu } from '../../components/SideMenu';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getAdminInstitutionPath, getSubUrl, UrlPathTemplate } from '../../utils/urlPaths';
import { PublisherClaimsSettings } from '../editor/PublisherClaimsSettings';
import { SerialPublicationClaimsSettings } from '../editor/SerialPublicationClaimsSettings';
import NotFound from '../errorpages/NotFound';
import { AdminCustomerInstitutionsContainer } from './app_admin/AdminCustomerInstitutionsContainer';
import { CentralImportCandidateForm } from './app_admin/central_import/CentralImportCandidateForm';
import { CentralImportCandidateMerge } from './app_admin/central_import/CentralImportCandidateMerge';
import { CentralImportDuplicationCheckPage } from './app_admin/central_import/CentralImportDuplicationCheckPage';
import { CentralImportPage } from './app_admin/central_import/CentralImportPage';
import { ImportCandidatesMenuFilters } from './app_admin/central_import/ImportCandidatesMenuFilters';
import { NviPeriodsPage } from './app_admin/NviPeriodsPage';
import { AddEmployeePage } from './institution_admin/AddEmployeePage';
import { PersonRegisterPage } from './institution_admin/person_register/PersonRegisterPage';

const isOnEditOrMergeImportCandidate = (path: string) =>
  path.endsWith(UrlPathTemplate.BasicDataCentralImportCandidateWizard.split('/').pop() as string) ||
  path.includes(UrlPathTemplate.BasicDataCentralImportCandidateMerge.split('/')[4]);

const BasicDataPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const isInstitutionAdmin = !!user?.customerId && user.isInstitutionAdmin;
  const isAppAdmin = !!user?.customerId && user.isAppAdmin;
  const isInternalImporter = !!user?.customerId && user.isInternalImporter;
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash

  const newCustomerIsSelected = currentPath === UrlPathTemplate.BasicDataInstitutions && location.search === '?id=new';
  const centralImportIsSelected = currentPath.startsWith(UrlPathTemplate.BasicDataCentralImport);

  const expandedMenu = currentPath === UrlPathTemplate.BasicDataCentralImport || !centralImportIsSelected;
  const simpleGoBack = centralImportIsSelected && isOnEditOrMergeImportCandidate(currentPath);

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        expanded={expandedMenu}
        minimizedMenu={
          simpleGoBack ? (
            <MinimizedMenuIconButton title={t('basic_data.basic_data')} onClick={() => navigate(-1)}>
              <BusinessCenterIcon />
            </MinimizedMenuIconButton>
          ) : (
            <MinimizedMenuIconButton
              title={t('basic_data.basic_data')}
              to={{
                pathname: UrlPathTemplate.BasicDataCentralImport,
                search: location.state?.previousSearch,
              }}>
              <BusinessCenterIcon />
            </MinimizedMenuIconButton>
          )
        }>
        <SideNavHeader icon={BusinessCenterIcon} text={t('basic_data.basic_data')} />
        {isInstitutionAdmin && (
          <NavigationListAccordion
            title={t('basic_data.person_register.person_register')}
            startIcon={<PeopleIcon sx={{ bgcolor: 'person.main' }} />}
            accordionPath={UrlPathTemplate.BasicDataPersonRegister}
            dataTestId={dataTestId.basicData.personRegisterAccordion}>
            <NavigationList aria-label={t('basic_data.person_register.person_register')}>
              <SelectableButton
                data-testid={dataTestId.basicData.personRegisterLink}
                isSelected={currentPath === UrlPathTemplate.BasicDataPersonRegister}
                to={UrlPathTemplate.BasicDataPersonRegister}>
                {t('basic_data.person_register.person_register')}
              </SelectableButton>
            </NavigationList>

            <Divider sx={{ mt: '0.5rem' }} />

            <LinkCreateButton
              data-testid={dataTestId.basicData.addEmployeeLink}
              variant="outlined"
              isSelected={currentPath === UrlPathTemplate.BasicDataAddEmployee}
              selectedColor="person.main"
              to={UrlPathTemplate.BasicDataAddEmployee}
              title={t('basic_data.add_employee.add_employee')}
            />
          </NavigationListAccordion>
        )}

        {isAppAdmin && (
          <>
            <NavigationListAccordion
              title={t('common.institutions')}
              startIcon={<AccountBalanceIcon sx={{ bgcolor: 'grey.500' }} />}
              accordionPath={UrlPathTemplate.BasicDataInstitutions}
              dataTestId={dataTestId.basicData.institutionsAccordion}>
              <NavigationList aria-label={t('common.institutions')}>
                <SelectableButton
                  data-testid={dataTestId.basicData.adminInstitutionsLink}
                  isSelected={currentPath === UrlPathTemplate.BasicDataInstitutions && !newCustomerIsSelected}
                  to={UrlPathTemplate.BasicDataInstitutions}>
                  {t('common.institutions')}
                </SelectableButton>
              </NavigationList>
              <Divider sx={{ mt: '0.5rem' }} />
              <LinkCreateButton
                data-testid={dataTestId.basicData.addCustomerLink}
                isSelected={newCustomerIsSelected}
                selectedColor="grey.500"
                to={getAdminInstitutionPath('new')}
                title={t('basic_data.institutions.add_institution')}
              />
            </NavigationListAccordion>

            <NavigationListAccordion
              title={t('common.nvi')}
              startIcon={<AdjustIcon sx={{ bgcolor: 'nvi.main' }} />}
              accordionPath={UrlPathTemplate.BasicDataNvi}
              dataTestId={dataTestId.basicData.nviPeriodsLink}>
              <NavigationList aria-label={t('common.nvi')}>
                <SelectableButton
                  isSelected={currentPath === UrlPathTemplate.BasicDataNvi}
                  to={UrlPathTemplate.BasicDataNvi}>
                  {t('basic_data.nvi.reporting_periods')}
                </SelectableButton>
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

            <NavigationListAccordion
              title={t('editor.institution.channel_claims.channel_claim')}
              startIcon={<LockOutlineIcon sx={{ bgcolor: 'grey.500' }} />}
              accordionPath={UrlPathTemplate.BasicDataChannelClaims}
              defaultPath={UrlPathTemplate.BasicDataPublisherClaims}
              dataTestId={dataTestId.basicData.channelClaimLink}>
              <NavigationList aria-label={t('editor.institution.channel_claims.channel_claim')}>
                <Typography sx={{ mt: '0.5rem' }}>
                  {t('editor.institution.channel_claims.channel_claims_settings_description')}
                </Typography>
                <SelectableButton
                  isSelected={currentPath === UrlPathTemplate.BasicDataPublisherClaims}
                  data-testid={dataTestId.basicData.publisherClaimsLink}
                  to={UrlPathTemplate.BasicDataPublisherClaims}>
                  {t('editor.institution.channel_claims.administer_publisher_channel_claim')}
                </SelectableButton>
                <SelectableButton
                  isSelected={currentPath === UrlPathTemplate.BasicDataSerialPublicationClaims}
                  data-testid={dataTestId.basicData.serialPublicationClaimsLink}
                  to={UrlPathTemplate.BasicDataSerialPublicationClaims}>
                  {t('editor.institution.channel_claims.administer_serial_publication_channel_claim')}
                </SelectableButton>
              </NavigationList>
            </NavigationListAccordion>
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
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportCandidateMerge />} />}
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
