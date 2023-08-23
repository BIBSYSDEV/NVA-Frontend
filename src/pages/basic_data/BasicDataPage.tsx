import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import { Divider, FormControlLabel, FormGroup, MenuItem, Radio, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Redirect, Switch, useLocation } from 'react-router-dom';
import { fetchImportCandidates } from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import {
  LinkButton,
  LinkCreateButton,
  NavigationList,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { SideMenu, StyledMinimizedMenuButton } from '../../components/SideMenu';
import { RootState } from '../../redux/store';
import { ImportCandidateStatus } from '../../types/importCandidate.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate, getAdminInstitutionPath } from '../../utils/urlPaths';
import { AdminCustomerInstitutionsContainer } from './app_admin/AdminCustomerInstitutionsContainer';
import { CentralImportDuplicationCheckPage } from './app_admin/central_import/CentralImportDuplicationCheckPage';
import { CentralImportPage } from './app_admin/central_import/CentralImportPage';
import { AddEmployeePage } from './institution_admin/AddEmployeePage';
import { PersonRegisterPage } from './institution_admin/person_register/PersonRegisterPage';

export type CandidateStatusFilter = {
  [key in ImportCandidateStatus]: boolean;
};

const thisYear = new Date().getFullYear();
const yearOptions = [thisYear, thisYear - 1, thisYear - 2, thisYear - 3, thisYear - 4, thisYear - 5];

const BasicDataPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const isInstitutionAdmin = !!user?.customerId && user.isInstitutionAdmin;
  const isAppAdmin = !!user?.customerId && user.isAppAdmin;
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash

  const newCustomerIsSelected = currentPath === UrlPathTemplate.BasicDataInstitutions && location.search === '?id=new';

  const [selectedImportCandidateStatus, setSelectedImportCandidateStatus] = useState<CandidateStatusFilter>({
    NOT_IMPORTED: true,
    IMPORTED: false,
    NOT_APPLICABLE: false,
  });
  const [candidateYearFilter, setCandidateYearFilter] = useState(yearOptions[0]);

  const importCandidatesFacetsQuery = useQuery({
    enabled: location.pathname === UrlPathTemplate.BasicDataCentralImport,
    queryKey: ['importCandidatesFacets', candidateYearFilter],
    queryFn: () => fetchImportCandidates(0, 0, `publicationYear:${candidateYearFilter}`),
    meta: { errorMessage: t('feedback.error.get_import_candidates') },
  });

  const statusBuckets = importCandidatesFacetsQuery.data?.aggregations?.['importStatus.candidateStatus'].buckets;
  const toImportCount = statusBuckets
    ? (statusBuckets.find((bucket) => bucket.key === 'NOT_IMPORTED')?.docCount ?? 0).toLocaleString()
    : '';
  const importedCount = statusBuckets
    ? (statusBuckets.find((bucket) => bucket.key === 'IMPORTED')?.docCount ?? 0).toLocaleString()
    : '';
  const notApplicableCount = statusBuckets
    ? (statusBuckets.find((bucket) => bucket.key === 'NOT_APPLICABLE')?.docCount ?? 0).toLocaleString()
    : '';

  const expandedMenu =
    location.pathname === UrlPathTemplate.BasicDataCentralImport ||
    !location.pathname.startsWith(UrlPathTemplate.BasicDataCentralImport);

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        aria-labelledby="basic-data-title"
        expanded={expandedMenu}
        minimizedMenu={
          <Link to={UrlPathTemplate.BasicDataCentralImport}>
            <StyledMinimizedMenuButton title={t('basic_data.basic_data')}>
              <BusinessCenterIcon />
            </StyledMinimizedMenuButton>
          </Link>
        }>
        <SideNavHeader icon={BusinessCenterIcon} text={t('basic_data.basic_data')} id="basic-data-title" />
        {user?.isInstitutionAdmin && (
          <NavigationListAccordion
            title={t('basic_data.person_register.person_register')}
            startIcon={
              <PeopleIcon
                sx={{
                  bgcolor: 'person.main',
                  padding: '0.1rem',
                }}
              />
            }
            accordionPath={UrlPathTemplate.BasicDataPersonRegister}
            dataTestId={dataTestId.basicData.personRegisterAccordion}>
            <NavigationList>
              <LinkButton
                data-testid={dataTestId.basicData.personRegisterLink}
                isSelected={currentPath === UrlPathTemplate.BasicDataPersonRegister}
                to={UrlPathTemplate.BasicDataPersonRegister}>
                {t('basic_data.person_register.person_register')}
              </LinkButton>
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
          <NavigationListAccordion
            title={t('common.institutions')}
            startIcon={
              <StoreIcon
                sx={{
                  bgcolor: 'grey.500',
                  padding: '0.1rem',
                }}
              />
            }
            accordionPath={UrlPathTemplate.BasicDataInstitutions}
            dataTestId={dataTestId.basicData.institutionsAccordion}>
            <NavigationList>
              <LinkButton
                data-testid={dataTestId.basicData.adminInstitutionsLink}
                isSelected={currentPath === UrlPathTemplate.BasicDataInstitutions && !newCustomerIsSelected}
                to={UrlPathTemplate.BasicDataInstitutions}>
                {t('common.institutions')}
              </LinkButton>
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
        )}

        {user?.isAppAdminImporter && (
          <NavigationListAccordion
            title={t('basic_data.central_import.central_import')}
            startIcon={
              <FilterDramaIcon
                sx={{
                  bgcolor: 'centralImport.main',
                  padding: '0.1rem',
                }}
              />
            }
            accordionPath={UrlPathTemplate.BasicDataCentralImport}
            dataTestId={dataTestId.basicData.centralImportAccordion}>
            <NavigationList component="div">
              <FormGroup sx={{ mx: '1rem' }}>
                <FormControlLabel
                  data-testid={dataTestId.basicData.centralImport.filter.notImportedRadio}
                  checked={selectedImportCandidateStatus.NOT_IMPORTED}
                  control={
                    <Radio
                      onChange={() =>
                        setSelectedImportCandidateStatus({
                          NOT_IMPORTED: !selectedImportCandidateStatus.NOT_IMPORTED,
                          IMPORTED: false,
                          NOT_APPLICABLE: false,
                        })
                      }
                    />
                  }
                  label={
                    toImportCount
                      ? `${t('basic_data.central_import.status.NOT_IMPORTED')} (${toImportCount})`
                      : t('basic_data.central_import.status.NOT_IMPORTED')
                  }
                />
                <FormControlLabel
                  data-testid={dataTestId.basicData.centralImport.filter.importedRadio}
                  checked={selectedImportCandidateStatus.IMPORTED}
                  control={
                    <Radio
                      onChange={() =>
                        setSelectedImportCandidateStatus({
                          NOT_IMPORTED: false,
                          IMPORTED: !selectedImportCandidateStatus.IMPORTED,
                          NOT_APPLICABLE: false,
                        })
                      }
                    />
                  }
                  label={
                    importedCount
                      ? `${t('basic_data.central_import.status.IMPORTED')} (${importedCount})`
                      : t('basic_data.central_import.status.IMPORTED')
                  }
                />
                <FormControlLabel
                  data-testid={dataTestId.basicData.centralImport.filter.notApplicableRadio}
                  checked={selectedImportCandidateStatus.NOT_APPLICABLE}
                  control={
                    <Radio
                      onChange={() =>
                        setSelectedImportCandidateStatus({
                          NOT_IMPORTED: false,
                          IMPORTED: false,
                          NOT_APPLICABLE: !selectedImportCandidateStatus.NOT_APPLICABLE,
                        })
                      }
                    />
                  }
                  label={
                    notApplicableCount
                      ? `${t('basic_data.central_import.status.NOT_APPLICABLE')} (${notApplicableCount})`
                      : t('basic_data.central_import.status.NOT_APPLICABLE')
                  }
                />

                <Select
                  size="small"
                  sx={{ mt: '0.5rem' }}
                  value={candidateYearFilter}
                  onChange={(event) => setCandidateYearFilter(+event.target.value)}>
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormGroup>
            </NavigationList>
          </NavigationListAccordion>
        )}
      </SideMenu>

      <Switch>
        <ErrorBoundary>
          <PrivateRoute exact path={UrlPathTemplate.BasicData} isAuthorized={isAppAdmin || isInstitutionAdmin}>
            {isInstitutionAdmin ? (
              <Redirect to={UrlPathTemplate.BasicDataPersonRegister} />
            ) : isAppAdmin ? (
              <Redirect to={UrlPathTemplate.BasicDataInstitutions} />
            ) : null}
          </PrivateRoute>

          <PrivateRoute
            exact
            path={UrlPathTemplate.BasicDataInstitutions}
            component={AdminCustomerInstitutionsContainer}
            isAuthorized={isAppAdmin}
          />
          <PrivateRoute exact path={UrlPathTemplate.BasicDataCentralImport} isAuthorized={isAppAdmin}>
            <CentralImportPage statusFilter={selectedImportCandidateStatus} yearFilter={candidateYearFilter} />
          </PrivateRoute>
          <PrivateRoute
            exact
            path={UrlPathTemplate.BasicDataCentralImportDuplicateCheck}
            component={CentralImportDuplicationCheckPage}
            isAuthorized={isAppAdmin}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.BasicDataAddEmployee}
            component={AddEmployeePage}
            isAuthorized={isInstitutionAdmin}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.BasicDataPersonRegister}
            component={PersonRegisterPage}
            isAuthorized={isInstitutionAdmin}
          />
        </ErrorBoundary>
      </Switch>
    </StyledPageWithSideMenu>
  );
};

export default BasicDataPage;
