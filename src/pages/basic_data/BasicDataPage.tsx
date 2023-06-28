import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router-dom';
import { Divider } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getAdminInstitutionPath, UrlPathTemplate } from '../../utils/urlPaths';
import { AdminCustomerInstitutionsContainer } from './app_admin/AdminCustomerInstitutionsContainer';
import { AddEmployeePage } from './institution_admin/AddEmployeePage';
import { CentralImportPage } from './app_admin/central_import/CentralImportPage';
import { CentralImportDuplicationCheckPage } from './app_admin/central_import/CentralImportDuplicationCheckPage';
import { PersonRegisterPage } from './institution_admin/person_register/PersonRegisterPage';
import {
  LinkButton,
  LinkCreateButton,
  NavigationList,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { CentralImportRegistration } from './app_admin/central_import/CentralImportRegistration';
import { SideMenu } from '../../components/SideMenu';

const BasicDataPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const isInstitutionAdmin = !!user?.customerId && user.isInstitutionAdmin;
  const isAppAdmin = !!user?.customerId && user.isAppAdmin;
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  useEffect(() => {
    if (currentPath === UrlPathTemplate.BasicData) {
      if (user?.isInstitutionAdmin) {
        history.replace(UrlPathTemplate.BasicDataPersonRegister);
      } else if (user?.isAppAdmin) {
        history.replace(UrlPathTemplate.BasicDataInstitutions);
      }
    }
  }, [history, currentPath, user?.isInstitutionAdmin, user?.isAppAdmin]);

  const newCustomerIsSelected =
    currentPath === UrlPathTemplate.BasicDataInstitutions && history.location.search === '?id=new';

  return (
    <StyledPageWithSideMenu>
      <SideMenu aria-labelledby="basic-data-title">
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
            accordionPath={'/basic-data/person-register'}
            defaultPath={'/basic-data/person-register'}
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
          <>
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
              accordionPath={'/basic-data/institutions'}
              defaultPath={'/basic-data/institutions'}
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

            <BetaFunctionality>
              <NavigationListAccordion
                title={t('basic_data.central_import.central_import')}
                startIcon={
                  <FilterDramaIcon
                    sx={{
                      bgcolor: 'grey.400',
                      padding: '0.1rem',
                    }}
                  />
                }
                accordionPath={'/basic-data/central-import'}
                defaultPath={'/basic-data/central-import'}
                dataTestId={dataTestId.basicData.centralImportAccordion}>
                <NavigationList>
                  <LinkButton
                    data-testid={dataTestId.basicData.centralImportLink}
                    isSelected={currentPath === UrlPathTemplate.BasicDataCentralImport}
                    to={UrlPathTemplate.BasicDataCentralImport}>
                    {t('basic_data.central_import.central_import')}
                  </LinkButton>
                </NavigationList>
              </NavigationListAccordion>
            </BetaFunctionality>
          </>
        )}
      </SideMenu>
      <BackgroundDiv>
        <Switch>
          <ErrorBoundary>
            <PrivateRoute
              exact
              path={UrlPathTemplate.BasicDataInstitutions}
              component={AdminCustomerInstitutionsContainer}
              isAuthorized={isAppAdmin}
            />
            <PrivateRoute
              exact
              path={UrlPathTemplate.BasicDataCentralImport}
              component={CentralImportPage}
              isAuthorized={isAppAdmin}
            />
            <PrivateRoute
              exact
              path={UrlPathTemplate.BasicDataCentralImportDuplicateCheck}
              component={CentralImportDuplicationCheckPage}
              isAuthorized={isAppAdmin}
            />
            <PrivateRoute
              exact
              path={UrlPathTemplate.BasicDataCentralImportRegistration}
              component={CentralImportRegistration}
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
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default BasicDataPage;
