import { useEffect } from 'react';
import { Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router-dom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { AppAdminRoute, InstitutionAdminRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { AdminCustomerInstitutionsContainer } from './app_admin/AdminCustomerInstitutionsContainer';
import { AddEmployeePage } from './institution_admin/AddEmployeePage';
import { CentralImportPage } from './app_admin/central_import/CentralImportPage';
import { MyInstitutionUsersPage } from './institution_admin/MyInstitutionUsersPage';
import { CentralImportDuplicationCheckPage } from './app_admin/central_import/CentralImportDuplicationCheckPage';
import { PersonRegisterPage } from './institution_admin/person_register/PersonRegisterPage';
import {
  LinkButton,
  LinkButtonRow,
  NavigationList,
  SideMenu,
  StyledPageWithSideMenu,
  StyledSideMenuHeader,
} from '../../components/PageWithSideMenu';

const BasicDataPage = () => {
  const { t } = useTranslation('basicData');
  const user = useSelector((store: RootState) => store.user);
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  useEffect(() => {
    if (currentPath === UrlPathTemplate.BasicData) {
      if (user?.isInstitutionAdmin) {
        history.replace(UrlPathTemplate.BasicDataUsers);
      } else if (user?.isAppAdmin) {
        history.replace(UrlPathTemplate.BasicDataInstitutions);
      }
    }
  }, [history, currentPath, user?.isInstitutionAdmin, user?.isAppAdmin]);

  return (
    <StyledPageWithSideMenu>
      <SideMenu>
        <StyledSideMenuHeader>
          <BusinessCenterIcon fontSize="large" />
          <Typography component="h1" variant="h2">
            {t('basic_data')}
          </Typography>
        </StyledSideMenuHeader>

        <NavigationList>
          {user?.isInstitutionAdmin && [
            <li key={dataTestId.basicData.personRegisterLink}>
              <LinkButtonRow>
                <li>
                  <LinkButton
                    data-testid={dataTestId.basicData.personRegisterLink}
                    isSelected={currentPath === UrlPathTemplate.BasicDataPersonRegister}
                    to={UrlPathTemplate.BasicDataPersonRegister}>
                    {t('person_register.person_register')}
                  </LinkButton>
                </li>
                <li>
                  <LinkButton
                    data-testid={dataTestId.basicData.addEmployeeLink}
                    isSelected={currentPath === UrlPathTemplate.BasicDataAddEmployee}
                    to={UrlPathTemplate.BasicDataAddEmployee}
                    title={t('add_employee')}>
                    <PersonAddIcon />
                  </LinkButton>
                </li>
              </LinkButtonRow>
            </li>,
            <li key={dataTestId.basicData.adminUsersLink}>
              <LinkButton
                data-testid={dataTestId.basicData.adminUsersLink}
                isSelected={currentPath === UrlPathTemplate.BasicDataUsers}
                to={UrlPathTemplate.BasicDataUsers}>
                {t('common:users')}
              </LinkButton>
            </li>,
          ]}
          <Divider orientation="horizontal" />
          {user?.isAppAdmin && [
            <BetaFunctionality key={dataTestId.basicData.centralImportLink} component="li">
              <LinkButton
                data-testid={dataTestId.basicData.centralImportLink}
                isSelected={currentPath === UrlPathTemplate.BasicDataCentralImport}
                to={UrlPathTemplate.BasicDataCentralImport}>
                {t('central_import.central_import')}
              </LinkButton>
            </BetaFunctionality>,
            <li key={dataTestId.basicData.adminInstitutionsLink}>
              <LinkButton
                data-testid={dataTestId.basicData.adminInstitutionsLink}
                isSelected={currentPath === UrlPathTemplate.BasicDataInstitutions}
                to={UrlPathTemplate.BasicDataInstitutions}>
                {t('common:institutions')}
              </LinkButton>
            </li>,
          ]}
        </NavigationList>
      </SideMenu>
      <BackgroundDiv>
        <Switch>
          <AppAdminRoute
            exact
            path={UrlPathTemplate.BasicDataInstitutions}
            component={AdminCustomerInstitutionsContainer}
          />
          <AppAdminRoute exact path={UrlPathTemplate.BasicDataCentralImport} component={CentralImportPage} />
          <AppAdminRoute
            exact
            path={UrlPathTemplate.BasicDataCentralImportDuplicateCheck}
            component={CentralImportDuplicationCheckPage}
          />
          <InstitutionAdminRoute exact path={UrlPathTemplate.BasicDataAddEmployee} component={AddEmployeePage} />
          <InstitutionAdminRoute exact path={UrlPathTemplate.BasicDataUsers} component={MyInstitutionUsersPage} />
          <InstitutionAdminRoute exact path={UrlPathTemplate.BasicDataPersonRegister} component={PersonRegisterPage} />
        </Switch>
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default BasicDataPage;
