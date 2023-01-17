import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { CreatorRoute, LoggedInRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { MyMessagesPage } from '../messages/MyMessagesPage';
import { MyRegistrations } from '../my_registrations/MyRegistrations';
import { MyProfile } from './user_profile/MyProfile';
import {
  LinkButton,
  LinkButtonRow,
  LinkIconButton,
  NavigationList,
  SidePanel,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import ResearchProfile from '../research_profile/ResearchProfile';
import { Box } from '@mui/system';
import { Divider, Icon, IconButton } from '@mui/material';

const MyPagePage = () => {
  const { t } = useTranslation();
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
      <SidePanel aria-labelledby="my-page-title">
        <SideNavHeader icon={FavoriteBorderIcon} text={t('my_page.my_page')} id="my-page-title" />

        <NavigationList>
          {user?.isCreator && [
            <LinkButton
              key={dataTestId.myPage.messagesLink}
              data-testid={dataTestId.myPage.messagesLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMessages}
              to={UrlPathTemplate.MyPageMessages}>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <ChatBubbleIcon />
                {t('my_page.messages.messages')}
              </Box>
            </LinkButton>,
            <Divider />,
            <LinkButtonRow key={dataTestId.myPage.myRegistrationsLink}>
              <LinkButton
                data-testid={dataTestId.myPage.myRegistrationsLink}
                isSelected={currentPath === UrlPathTemplate.MyPageRegistrations}
                to={UrlPathTemplate.MyPageRegistrations}>
                {t('common.registrations')}
              </LinkButton>
              <LinkIconButton
                data-testid={dataTestId.myPage.newRegistrationLink}
                to={UrlPathTemplate.RegistrationNew}
                icon={<AddCircleOutlineOutlined />}
                title={t('registration.new_registration')}
              />
            </LinkButtonRow>,
            <Divider />,
          ]}
          <LinkButton
            data-testid={dataTestId.myPage.researchProfileLink}
            isSelected={currentPath === UrlPathTemplate.MyPageResearchProfile}
            to={UrlPathTemplate.MyPageResearchProfile}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={orcidIcon} height="20" alt={t('common.orcid')} />
              {t('my_page.research_profile')}
            </Box>
          </LinkButton>
          <Divider />
          <LinkButton
            data-testid={dataTestId.myPage.myProfileLink}
            isSelected={currentPath === UrlPathTemplate.MyPageMyProfile}
            to={UrlPathTemplate.MyPageMyProfile}>
            {t('my_page.my_profile.user_profile')}
          </LinkButton>
        </NavigationList>
      </SidePanel>

      <Switch>
        <ErrorBoundary>
          <CreatorRoute exact path={UrlPathTemplate.MyPageMessages} component={MyMessagesPage} />
          <CreatorRoute exact path={UrlPathTemplate.MyPageRegistrations} component={MyRegistrations} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProfile} component={MyProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageResearchProfile} component={ResearchProfile} />
        </ErrorBoundary>
      </Switch>
    </StyledPageWithSideMenu>
  );
};

export default MyPagePage;
