import { Box, Typography, ListItemText, MenuItem, MenuList, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Switch, useHistory } from 'react-router-dom';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { dataTestId } from '../../utils/dataTestIds';
import { AppAdminRoute, InstitutionAdminRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { AdminCustomerInstitutionsContainer } from './app_admin/AdminCustomerInstitutionsContainer';
import { AddEmployeePage } from './institution_admin/AddEmployeePage';
import { CentralImportPage } from './app_admin/CentralImportPage';
import { MyCustomerInstitutionPage } from './institution_admin/MyInstitutionPage';
import { MyInstitutionUsersPage } from './institution_admin/MyInstitutionUsersPage';
import { useEffect } from 'react';

const BasicDataPage = () => {
  const { t } = useTranslation('basicData');
  const user = useSelector((store: RootStore) => store.user);
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
        p: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 5fr',
        gap: '1rem',
      }}>
      <BackgroundDiv>
        <Typography variant="h3" component="h1">
          {t('basic_data')}
        </Typography>
        <MenuList>
          {user?.isInstitutionAdmin && [
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
              key={dataTestId.basicData.adminInstitutionLink}
              data-testid={dataTestId.basicData.adminInstitutionLink}
              component={Link}
              selected={currentPath === UrlPathTemplate.BasicDataMyInstitution}
              to={UrlPathTemplate.BasicDataMyInstitution}>
              <ListItemText>
                <Typography variant="overline" color="primary" fontSize="1rem">
                  {t('common:my_institution')}
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
                    {t('central_import')}
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
      </BackgroundDiv>
      <BackgroundDiv>
        <Switch>
          <AppAdminRoute
            exact
            path={UrlPathTemplate.BasicDataInstitutions}
            component={AdminCustomerInstitutionsContainer}
          />
          <AppAdminRoute exact path={UrlPathTemplate.BasicDataCentralImport} component={CentralImportPage} />
          <InstitutionAdminRoute exact path={UrlPathTemplate.BasicDataAddEmployee} component={AddEmployeePage} />
          <InstitutionAdminRoute
            exact
            path={UrlPathTemplate.BasicDataMyInstitution}
            component={MyCustomerInstitutionPage}
          />
          <InstitutionAdminRoute exact path={UrlPathTemplate.BasicDataUsers} component={MyInstitutionUsersPage} />
        </Switch>
      </BackgroundDiv>
    </Box>
  );
};

export default BasicDataPage;
