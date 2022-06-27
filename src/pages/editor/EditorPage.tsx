import { Box, ListItemText, MenuItem, MenuList, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Switch, useHistory } from 'react-router-dom';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { VocabularySettings } from './VocabularySettings';
import { PublishStrategySettings } from './PublishStrategySettings';
import { EditorRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { EditorInstitution } from './EditorInstitution';

const EditorPage = () => {
  const { t } = useTranslation('editor');
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  useEffect(() => {
    if (currentPath === UrlPathTemplate.Editor) {
      history.replace(UrlPathTemplate.EditorInstitution);
    }
  }, [history, currentPath]);

  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 0, md: '1rem' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 5fr' },
        gap: '1rem',
      }}>
      <BackgroundDiv component="nav">
        <MenuList dense>
          <MenuItem
            component={Link}
            selected={currentPath === UrlPathTemplate.EditorInstitution}
            to={UrlPathTemplate.EditorInstitution}>
            <ListItemText>
              <Typography variant="overline" color="primary" fontSize="1rem">
                {t('institution.institution_name')}
              </Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem
            component={Link}
            selected={currentPath === UrlPathTemplate.EditorVocabulary}
            to={UrlPathTemplate.EditorVocabulary}>
            <ListItemText>
              <Typography variant="overline" color="primary" fontSize="1rem">
                {t('vocabulary')}
              </Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem
            component={Link}
            selected={currentPath === UrlPathTemplate.EditorPublishStrategy}
            to={UrlPathTemplate.EditorPublishStrategy}>
            <ListItemText>
              <Typography variant="overline" color="primary" fontSize="1rem">
                {t('publish_strategy.publish_strategy')}
              </Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </BackgroundDiv>
      <BackgroundDiv>
        <Switch>
          <EditorRoute exact path={UrlPathTemplate.EditorVocabulary} component={VocabularySettings} />
          <EditorRoute exact path={UrlPathTemplate.EditorPublishStrategy} component={PublishStrategySettings} />
          <EditorRoute exact path={UrlPathTemplate.EditorInstitution} component={EditorInstitution} />
        </Switch>
      </BackgroundDiv>
    </Box>
  );
};

export default EditorPage;
