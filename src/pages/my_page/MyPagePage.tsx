import { Box, ListItemText, MenuItem, MenuList, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Switch, useHistory } from 'react-router-dom';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { dataTestId } from '../../utils/dataTestIds';
import { CreatorRoute, LoggedInRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { MyMessagesPage } from '../messages/MyMessagesPage';
import { MyRegistrations } from '../my_registrations/MyRegistrations';
import PublicProfile from '../public_profile/PublicProfile';
import { MyProfile } from './user_profile/MyProfile';

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
        p: { xs: 0, md: '1rem' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 5fr' },
        gap: '1rem',
      }}>
      <BackgroundDiv component="nav">
        <MenuList dense>
          <MenuItem
            data-testid={dataTestId.myPage.messagesLink}
            component={Link}
            selected={currentPath === UrlPathTemplate.MyPageMessages}
            to={UrlPathTemplate.MyPageMessages}>
            <ListItemText>
              <Typography variant="overline" color="primary" fontSize="1rem">
                {t('messages.messages')}
              </Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem
            data-testid={dataTestId.myPage.myRegistrationsLink}
            component={Link}
            selected={currentPath === UrlPathTemplate.MyPageRegistrations}
            to={UrlPathTemplate.MyPageRegistrations}>
            <ListItemText>
              <Typography variant="overline" color="primary" fontSize="1rem">
                {t('registrations.my_registrations')}
              </Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem
            data-testid={dataTestId.myPage.researchProfileLink}
            component={Link}
            selected={currentPath === UrlPathTemplate.MyPageResearchProfile}
            to={UrlPathTemplate.MyPageResearchProfile}>
            <ListItemText>
              <Typography variant="overline" color="primary" fontSize="1rem">
                {t('public_profile')}
              </Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem
            data-testid={dataTestId.myPage.myProfileLink}
            component={Link}
            selected={currentPath === UrlPathTemplate.MyPageMyProfile}
            to={UrlPathTemplate.MyPageMyProfile}>
            <ListItemText>
              <Typography variant="overline" color="primary" fontSize="1rem">
                {t('my_profile.my_profile')}
              </Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </BackgroundDiv>
      <BackgroundDiv>
        <Switch>
          <CreatorRoute exact path={UrlPathTemplate.MyPageMessages} component={MyMessagesPage} />
          <CreatorRoute exact path={UrlPathTemplate.MyPageRegistrations} component={MyRegistrations} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProfile} component={MyProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageResearchProfile} component={PublicProfile} />
        </Switch>
      </BackgroundDiv>
    </Box>
  );
};

export default MyPagePage;
