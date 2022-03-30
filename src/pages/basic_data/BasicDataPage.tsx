import { Box, Typography, ListItemText, MenuItem, MenuList, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Switch } from 'react-router-dom';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { dataTestId } from '../../utils/dataTestIds';
import { AppAdminRoute, InstitutionAdminRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import AdminCustomerInstitutionsPage from '../admin/AdminCustomerInstitutionsPage';
import { AddEmployee } from './AddEmployee';
import { CentralImport } from './app_admin/CentralImport';

const BasicDataPage = () => {
  const { t } = useTranslation('basicData');
  const user = useSelector((store: RootStore) => store.user);

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
          {user?.isInstitutionAdmin && (
            <BetaFunctionality>
              <MenuItem component={Link} to={UrlPathTemplate.BasicDataAddEmployee}>
                <ListItemText>
                  <Typography variant="overline" color="primary" fontSize="1rem">
                    {t('add_employee')}
                  </Typography>
                </ListItemText>
              </MenuItem>
            </BetaFunctionality>
          )}
          <Divider orientation="horizontal" sx={{ my: '0.5rem', borderWidth: 1 }} />
          {user?.isAppAdmin && [
            <BetaFunctionality key="central-import">
              <MenuItem component={Link} to={UrlPathTemplate.BasicDataCentralImport}>
                <ListItemText>
                  <Typography variant="overline" color="primary" fontSize="1rem">
                    {t('central_import')}
                  </Typography>
                </ListItemText>
              </MenuItem>
            </BetaFunctionality>,
            <MenuItem
              key={dataTestId.header.adminInstitutionsLink}
              data-testid={dataTestId.header.adminInstitutionsLink}
              component={Link}
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
          <AppAdminRoute exact path={UrlPathTemplate.BasicDataInstitutions} component={AdminCustomerInstitutionsPage} />
          <AppAdminRoute exact path={UrlPathTemplate.BasicDataCentralImport} component={CentralImport} />
          <InstitutionAdminRoute exact path={UrlPathTemplate.BasicDataAddEmployee} component={AddEmployee} />
        </Switch>
      </BackgroundDiv>
    </Box>
  );
};

export default BasicDataPage;
