import { Box, Typography, ListItemText, MenuItem, MenuList } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BackgroundDiv } from '../../components/styled/Wrappers';

import { AddEmployee } from './AddEmployee';

enum DataItem {
  Person,
}

const DataPage = () => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(DataItem.Person);

  return (
    <Box sx={{ width: '100%', p: '1rem', display: 'grid', gridTemplateColumns: '1fr 5fr', gap: '1rem' }}>
      <BackgroundDiv>
        <MenuList>
          <MenuItem onClick={() => setSelectedItem(DataItem.Person)}>
            <ListItemText>
              <Typography
                variant="overline"
                sx={{
                  textDecoration: selectedItem === DataItem.Person ? 'underline 2px' : undefined,
                  textUnderlinePosition: 'under',
                }}
                color="primary"
                fontSize="1rem">
                {t('legg til ansatt')}
              </Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </BackgroundDiv>
      <BackgroundDiv>{selectedItem === DataItem.Person && <AddEmployee />}</BackgroundDiv>
    </Box>
  );
};

export default DataPage;
