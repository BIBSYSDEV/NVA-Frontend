import { Box, Typography, ListItemText, MenuItem, MenuList } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { AddEmployee } from './AddEmployee';

enum BasicDataItem {
  Person,
}

const BasicDataPage = () => {
  const { t } = useTranslation('basicData');
  const [selectedItem, setSelectedItem] = useState(BasicDataItem.Person);

  return (
    <Box sx={{ width: '100%', p: '1rem', display: 'grid', gridTemplateColumns: '1fr 5fr', gap: '1rem' }}>
      <BackgroundDiv>
        <Typography variant="h3" component="h1">
          {t('basic_data')}
        </Typography>
        <MenuList>
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
        </MenuList>
      </BackgroundDiv>
      <BackgroundDiv>{selectedItem === BasicDataItem.Person && <AddEmployee />}</BackgroundDiv>
    </Box>
  );
};

export default BasicDataPage;
