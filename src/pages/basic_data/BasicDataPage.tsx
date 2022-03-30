import { Box, Typography, ListItemText, MenuItem, MenuList } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { AddEmployee } from './AddEmployee';

enum BasicDataItem {
  Person,
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
              <MenuItem onClick={() => setSelectedItem(BasicDataItem.Person)}>
                <ListItemText>
                  <Typography
                    variant="overline"
                    sx={{
                      textDecoration: selectedItem === BasicDataItem.Person ? 'underline 2px' : undefined,
                      textUnderlinePosition: 'under',
                    }}
                    color="primary"
                    fontSize="1rem">
                    {t('add_employee')}
                  </Typography>
                </ListItemText>
              </MenuItem>
            </BetaFunctionality>
          )}
        </MenuList>
      </BackgroundDiv>
      <BackgroundDiv>{selectedItem === BasicDataItem.Person ? <AddEmployee /> : null}</BackgroundDiv>
    </Box>
  );
};

export default BasicDataPage;
