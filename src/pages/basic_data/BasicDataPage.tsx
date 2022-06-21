import { useEffect } from 'react';
import { Box, Typography, ListItemText, MenuItem, MenuList, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Switch, useHistory } from 'react-router-dom';
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
    <Box
      sx={{
        width: '100%',
        minHeight: '50vh',
        p: { xs: 0, md: '1rem' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 5fr' },
        gap: '1rem',
      }}>
      <BackgroundDiv>
        <Typography variant="h3" component="h1">
          {t('basic_data')}
        </Typography>
        <nav>
          <MenuList dense>
            {user?.isInstitutionAdmin && [
              <BetaFunctionality key="person-register">
                <MenuItem
                  key={dataTestId.basicData.personRegisterLink}
                  data-testid={dataTestId.basicData.personRegisterLink}
                  component={Link}
                  selected={currentPath === UrlPathTemplate.BasicDataPersonRegister}
                  to={UrlPathTemplate.BasicDataPersonRegister}>
                  <ListItemText>
                    <Typography variant="overline" color="primary" fontSize="1rem">
                      {t('person_register.person_register')}
                    </Typography>
                  </ListItemText>
                </MenuItem>
              </BetaFunctionality>,
              <MenuItem
                key={dataTestId.basicData.addEmployeeLink}
                data-testid={dataTestId.basicData.addEmployeeLink}
                component={Link}
                selected={currentPath === UrlPathTemplate.BasicDataAddEmployee}
                to={UrlPathTemplate.BasicDataAddEmployee}>
                <ListItemText>
                  <Typography variant="overline" color="primary" fontSize="1rem">
                    {t('add_employee')}
                  </Typography>
                </ListItemText>
              </MenuItem>,
              <MenuItem
                key={dataTestId.basicData.adminUsersLink}
                data-testid={dataTestId.basicData.adminUsersLink}
                component={Link}
                selected={currentPath === UrlPathTemplate.BasicDataUsers}
                to={UrlPathTemplate.BasicDataUsers}>
                <ListItemText>
                  <Typography variant="overline" color="primary" fontSize="1rem">
                    {t('common:users')}
                  </Typography>
                </ListItemText>
              </MenuItem>,
            ]}
            <Divider orientation="horizontal" sx={{ my: '0.5rem', borderWidth: 1 }} />
            {user?.isAppAdmin && [
              <BetaFunctionality key="central-import">
                <MenuItem
                  key={dataTestId.basicData.centralImportLink}
                  data-testid={dataTestId.basicData.centralImportLink}
                  component={Link}
                  selected={currentPath === UrlPathTemplate.BasicDataCentralImport}
                  to={UrlPathTemplate.BasicDataCentralImport}>
                  <ListItemText>
                    <Typography variant="overline" color="primary" fontSize="1rem">
                      {t('central_import.central_import')}
                    </Typography>
                  </ListItemText>
                </MenuItem>
              </BetaFunctionality>,
              <MenuItem
                key={dataTestId.basicData.adminInstitutionsLink}
                data-testid={dataTestId.basicData.adminInstitutionsLink}
                component={Link}
                selected={currentPath === UrlPathTemplate.BasicDataInstitutions}
                to={UrlPathTemplate.BasicDataInstitutions}>
                <ListItemText>
                  <Typography variant="overline" color="primary" fontSize="1rem">
                    {t('common:institutions')}
                  </Typography>
                </ListItemText>
              </MenuItem>,
            ]}
          </MenuList>
        </nav>
      </BackgroundDiv>
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
    </Box>
  );
};

export default BasicDataPage;
