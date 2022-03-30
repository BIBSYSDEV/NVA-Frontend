import { Box, Typography, ListItemText, MenuItem, MenuList, Divider } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { dataTestId } from '../../utils/dataTestIds';
import AdminCustomerInstitutionsPage from '../admin/AdminCustomerInstitutionsPage';
import { AddEmployee } from './AddEmployee';
import { CentralImport } from './app_admin/CentralImport';

enum BasicDataItem {
  AddEmployee,
  CentralImport,
  Institutions,
}

const BasicDataPage = () => {
  const { t } = useTranslation('basicData');
  const user = useSelector((store: RootStore) => store.user);
  const [selectedItem, setSelectedItem] = useState<BasicDataItem>();

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
              <MenuItem
                onClick={() => setSelectedItem(BasicDataItem.AddEmployee)}
                selected={selectedItem === BasicDataItem.AddEmployee}>
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
            <MenuItem
              onClick={() => setSelectedItem(BasicDataItem.CentralImport)}
              key="central-import"
              selected={selectedItem === BasicDataItem.CentralImport}>
              <ListItemText>
                <Typography variant="overline" color="primary" fontSize="1rem">
                  {t('central_import')}
                </Typography>
              </ListItemText>
            </MenuItem>,
            <MenuItem
              onClick={() => setSelectedItem(BasicDataItem.Institutions)}
              key={dataTestId.header.adminInstitutionsLink}
              data-testid={dataTestId.header.adminInstitutionsLink}
              selected={selectedItem === BasicDataItem.Institutions}>
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
        {/* TODO: Current item should be based on URL path, not state: https://v5.reactrouter.com/web/example/nesting */}
        {selectedItem === BasicDataItem.AddEmployee ? (
          <AddEmployee />
        ) : selectedItem === BasicDataItem.CentralImport ? (
          <CentralImport />
        ) : selectedItem === BasicDataItem.Institutions ? (
          <AdminCustomerInstitutionsPage />
        ) : null}
      </BackgroundDiv>
    </Box>
  );
};

export default BasicDataPage;
