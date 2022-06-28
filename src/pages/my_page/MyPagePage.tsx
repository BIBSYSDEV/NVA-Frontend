import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Switch, useHistory } from 'react-router-dom';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { CreatorRoute, LoggedInRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { MyMessagesPage } from '../messages/MyMessagesPage';
import { MyRegistrations } from '../my_registrations/MyRegistrations';
import ResearchProfile from '../research_profile/ResearchProfile';
import { MyProfile } from './user_profile/MyProfile';

const MyPagePage = () => {
  const { t } = useTranslation('myPage');
  const user = useSelector((store: RootState) => store.user);
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  useEffect(() => {
    if (currentPath === UrlPathTemplate.MyPage) {
      if (user?.isCreator) {
        history.replace(UrlPathTemplate.MyPageMessages);
      } else {
        history.replace(UrlPathTemplate.MyPageResearchProfile);
      }
    }
  }, [history, currentPath, user?.isCreator]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '40vh',
        p: { xs: 0, md: '1rem' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
        gap: '1rem',
      }}>
      <BackgroundDiv component="nav" sx={{ p: '1rem' }}>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, 'li:not(:last-child)': { mb: '1rem' } }}>
          {user?.isCreator && [
            <li key={dataTestId.myPage.messagesLink}>
              <Button
                data-testid={dataTestId.myPage.messagesLink}
                variant={currentPath === UrlPathTemplate.MyPageMessages ? 'contained' : 'outlined'}
                size="large"
                component={Link}
                to={UrlPathTemplate.MyPageMessages}>
                {t('messages.messages')}
              </Button>
            </li>,
            <li key={dataTestId.myPage.myRegistrationsLink}>
              <Button
                data-testid={dataTestId.myPage.myRegistrationsLink}
                variant={currentPath === UrlPathTemplate.MyPageRegistrations ? 'contained' : 'outlined'}
                size="large"
                component={Link}
                to={UrlPathTemplate.MyPageRegistrations}>
                {t('registrations.my_registrations')}
              </Button>
            </li>,
          ]}
          <li>
            <Button
              data-testid={dataTestId.myPage.researchProfileLink}
              variant={currentPath === UrlPathTemplate.MyPageResearchProfile ? 'contained' : 'outlined'}
              size="large"
              component={Link}
              to={UrlPathTemplate.MyPageResearchProfile}>
              {t('research_profile')}
            </Button>
          </li>
          <li>
            <Button
              data-testid={dataTestId.myPage.myProfileLink}
              variant={currentPath === UrlPathTemplate.MyPageMyProfile ? 'contained' : 'outlined'}
              size="large"
              component={Link}
              to={UrlPathTemplate.MyPageMyProfile}>
              {t('my_profile.user_profile')}
            </Button>
          </li>
        </Box>
      </BackgroundDiv>
      <BackgroundDiv>
        <Switch>
          <CreatorRoute exact path={UrlPathTemplate.MyPageMessages} component={MyMessagesPage} />
          <CreatorRoute exact path={UrlPathTemplate.MyPageRegistrations} component={MyRegistrations} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProfile} component={MyProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageResearchProfile} component={ResearchProfile} />
        </Switch>
      </BackgroundDiv>
    </Box>
  );
};

export default MyPagePage;
