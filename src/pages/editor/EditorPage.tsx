import { Box, ListItemText, MenuItem, MenuList, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { VocabularySettings } from './VocabularySettings';
import { PublishStrategySettings } from './PublishStrategySettings';

enum EditorItem {
  Vocabulary,
  Workflow,
}

const EditorPage = () => {
  const { t } = useTranslation('editor');
  const [selectedItem, setSelectedItem] = useState(EditorItem.Vocabulary);

  return (
    <Box sx={{ width: '100%', p: '1rem', display: 'grid', gridTemplateColumns: '1fr 5fr', gap: '1rem' }}>
      <BackgroundDiv>
        <MenuList>
          <MenuItem onClick={() => setSelectedItem(EditorItem.Vocabulary)}>
            <ListItemText>
              <Typography
                variant="overline"
                sx={{
                  textDecoration: selectedItem === EditorItem.Vocabulary ? 'underline 2px' : undefined,
                  textUnderlinePosition: 'under',
                }}
                color="primary"
                fontSize="1rem">
                {t('vocabulary')}
              </Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setSelectedItem(EditorItem.Workflow)}>
            <ListItemText>
              <Typography
                variant="overline"
                sx={{
                  textDecoration: selectedItem === EditorItem.Workflow ? 'underline 2px' : undefined,
                  textUnderlinePosition: 'under',
                }}
                color="primary"
                fontSize="1rem">
                {t('workflow.publish_strategy')}
              </Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </BackgroundDiv>
      <BackgroundDiv>
        {selectedItem === EditorItem.Vocabulary ? (
          <VocabularySettings />
        ) : selectedItem === EditorItem.Workflow ? (
          <PublishStrategySettings />
        ) : null}
      </BackgroundDiv>
    </Box>
  );
};

export default EditorPage;
