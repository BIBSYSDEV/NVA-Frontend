import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { CreatorRoute, LoggedInRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { MyMessagesPage } from '../messages/MyMessagesPage';
import { MyRegistrations } from '../my_registrations/MyRegistrations';
import ResearchProfile from '../research_profile/ResearchProfile';
import { MyProfile } from './user_profile/MyProfile';
import {
  LinkButton,
  LinkButtonRow,
  NavigationList,
  SideMenu,
  StyledPageWithSideMenu,
  StyledSideMenuHeader,
} from '../../components/PageWithSideMenu';

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
    <StyledPageWithSideMenu>
      <SideMenu>
        <StyledSideMenuHeader>
          <FavoriteBorderIcon fontSize="large" />
          <Typography component="h1" variant="h2">
            {t('my_page')}
          </Typography>
        </StyledSideMenuHeader>
        <NavigationList>
          {user?.isCreator && [
            <li key={dataTestId.myPage.messagesLink}>
              <LinkButton
                data-testid={dataTestId.myPage.messagesLink}
                isSelected={currentPath === UrlPathTemplate.MyPageMessages}
                to={UrlPathTemplate.MyPageMessages}>
                {t('messages.messages')}
              </LinkButton>
            </li>,

            <li key={dataTestId.myPage.myRegistrationsLink}>
              <LinkButtonRow>
                <li>
                  <LinkButton
                    data-testid={dataTestId.myPage.myRegistrationsLink}
                    isSelected={currentPath === UrlPathTemplate.MyPageRegistrations}
                    to={UrlPathTemplate.MyPageRegistrations}>
                    {t('common:registrations')}
                  </LinkButton>
                </li>
                <li>
                  <LinkButton
                    data-testid={dataTestId.myPage.newRegistrationLink}
                    to={UrlPathTemplate.NewRegistration}
                    title={t('registration:new_registration')}>
                    <AddIcon />
                  </LinkButton>
                </li>
              </LinkButtonRow>
            </li>,
          ]}
          <li>
            <LinkButton
              data-testid={dataTestId.myPage.researchProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPageResearchProfile}
              to={UrlPathTemplate.MyPageResearchProfile}>
              {t('research_profile')}
            </LinkButton>
          </li>
          <li>
            <LinkButton
              data-testid={dataTestId.myPage.myProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyProfile}
              to={UrlPathTemplate.MyPageMyProfile}>
              {t('my_profile.user_profile')}
            </LinkButton>
          </li>
        </NavigationList>
      </SideMenu>
      <BackgroundDiv>
        <Switch>
          <CreatorRoute exact path={UrlPathTemplate.MyPageMessages} component={MyMessagesPage} />
          <CreatorRoute exact path={UrlPathTemplate.MyPageRegistrations} component={MyRegistrations} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProfile} component={MyProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageResearchProfile} component={ResearchProfile} />
        </Switch>
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default MyPagePage;
