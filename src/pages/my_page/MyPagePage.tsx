import { Box, ListItemText, MenuItem, MenuList, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Switch, useHistory } from 'react-router-dom';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { CreatorRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import MyMessagesPage from '../messages/MyMessagesPage';

const MyPagePage = () => {
  const { t } = useTranslation('myPage');
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  useEffect(() => {
    if (currentPath === UrlPathTemplate.MyPage) {
      history.replace(UrlPathTemplate.MyPageMessages);
    }
  }, [history, currentPath]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '60vh',
        p: { xs: 0, md: '1rem' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 5fr' },
        gap: '1rem',
      }}>
      <BackgroundDiv component="nav">
        <MenuList dense>
          <MenuItem
            component={Link}
            selected={currentPath === UrlPathTemplate.MyPageMessages}
            to={UrlPathTemplate.MyPageMessages}>
            <ListItemText>
              <Typography variant="overline" color="primary" fontSize="1rem">
                {t('worklist:messages')}
              </Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </BackgroundDiv>
      <BackgroundDiv>
        <Switch>
          <CreatorRoute exact path={UrlPathTemplate.MyPageMessages} component={MyMessagesPage} />
        </Switch>
      </BackgroundDiv>
    </Box>
  );
};

export default MyPagePage;
