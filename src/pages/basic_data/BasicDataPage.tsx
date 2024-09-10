import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AdjustIcon from '@mui/icons-material/Adjust';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import PeopleIcon from '@mui/icons-material/People';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import {
  LinkCreateButton,
  NavigationList,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { SideMenu, StyledMinimizedMenuButton } from '../../components/SideMenu';
import { RootState } from '../../redux/store';
import { ImportCandidateStatus } from '../../types/importCandidate.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getAdminInstitutionPath, UrlPathTemplate } from '../../utils/urlPaths';
import { AdminCustomerInstitutionsContainer } from './app_admin/AdminCustomerInstitutionsContainer';
import { NviPeriodsPage } from './app_admin/NviPeriodsPage';
import { CentralImportCandidateForm } from './app_admin/central_import/CentralImportCandidateForm';
import { CentralImportCandidateMerge } from './app_admin/central_import/CentralImportCandidateMerge';
import { CentralImportDuplicationCheckPage } from './app_admin/central_import/CentralImportDuplicationCheckPage';
import { CentralImportPage } from './app_admin/central_import/CentralImportPage';
import { ImportCandidatesMenuFilters } from './app_admin/central_import/ImportCandidatesMenuFilters';
import { AddEmployeePage } from './institution_admin/AddEmployeePage';
import { PersonRegisterPage } from './institution_admin/person_register/PersonRegisterPage';

export type CandidateStatusFilter = {
  [key in ImportCandidateStatus]: boolean;
};

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
        aria-labelledby="basic-data-title"
        expanded={expandedMenu}
        minimizedMenu={
          simpleGoBack ? (
            <StyledMinimizedMenuButton title={t('basic_data.basic_data')} onClick={() => navigate(-1)}>
              <BusinessCenterIcon />
            </StyledMinimizedMenuButton>
          ) : (
            <Link
              to={{
                pathname: UrlPathTemplate.BasicDataCentralImport,
                search: location.state?.previousSearch,
              }}>
              <StyledMinimizedMenuButton title={t('basic_data.basic_data')}>
                <BusinessCenterIcon />
              </StyledMinimizedMenuButton>
            </Link>
          )
        }>
        <SideNavHeader icon={BusinessCenterIcon} text={t('basic_data.basic_data')} id="basic-data-title" />
        {user?.isInstitutionAdmin && (
          <NavigationListAccordion
            title={t('basic_data.person_register.person_register')}
            startIcon={<PeopleIcon sx={{ bgcolor: 'person.main' }} />}
            accordionPath={UrlPathTemplate.BasicDataPersonRegister}
            dataTestId={dataTestId.basicData.personRegisterAccordion}>
            <NavigationList>
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

        {user?.isAppAdmin && (
          <>
            <NavigationListAccordion
              title={t('common.institutions')}
              startIcon={<AccountBalanceIcon sx={{ bgcolor: 'grey.500' }} />}
              accordionPath={UrlPathTemplate.BasicDataInstitutions}
              dataTestId={dataTestId.basicData.institutionsAccordion}>
              <NavigationList>
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
              <NavigationList>
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
          </>
        )}

        {user?.isInternalImporter && (
          <NavigationListAccordion
            title={t('basic_data.central_import.central_import')}
            startIcon={<FilterDramaIcon sx={{ bgcolor: 'centralImport.main' }} />}
            accordionPath={UrlPathTemplate.BasicDataCentralImport}
            dataTestId={dataTestId.basicData.centralImportAccordion}>
            <ImportCandidatesMenuFilters />
          </NavigationListAccordion>
        )}
      </SideMenu>

      <ErrorBoundary>
        <Routes>
          <Route
            path={UrlPathTemplate.BasicData}
            element={
              <PrivateRoute
                isAuthorized={isAppAdmin || isInstitutionAdmin}
                element={
                  isInstitutionAdmin ? (
                    <Navigate to={UrlPathTemplate.BasicDataPersonRegister} />
                  ) : isAppAdmin ? (
                    <Navigate to={UrlPathTemplate.BasicDataInstitutions} />
                  ) : (
                    <Navigate to="/forbidden" replace />
                  )
                }
              />
            }
          />
          <Route
            path={UrlPathTemplate.BasicDataInstitutions}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<AdminCustomerInstitutionsContainer />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataCentralImport}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataCentralImportCandidate}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportDuplicationCheckPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataCentralImportCandidateWizard}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportCandidateForm />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataCentralImportCandidateMerge}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportCandidateMerge />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataAddEmployee}
            element={<PrivateRoute isAuthorized={isInstitutionAdmin} element={<AddEmployeePage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataPersonRegister}
            element={<PrivateRoute isAuthorized={isInstitutionAdmin} element={<PersonRegisterPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataNvi}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<NviPeriodsPage />} />}
          />
        </Routes>
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default BasicDataPage;
