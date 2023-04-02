import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Divider } from '@mui/material';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { CreatorRoute, LoggedInRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { MyMessagesPage } from '../messages/MyMessagesPage';
import { MyRegistrations } from '../my_registrations/MyRegistrations';
import { MyProfile } from './user_profile/MyProfile';
import { MyProjects } from './user_profile/MyProjects';
import { MyResults } from './user_profile/MyResults';
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
import { ProjectFormDialog } from '../projects/form/ProjectFormDialog';

const MyPagePage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const [showCreateProject, setShowCreateProject] = useState(false);

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
              to={UrlPathTemplate.MyPageMessages}
              startIcon={<ChatBubbleOutlineOutlinedIcon />}>
              {t('my_page.messages.messages')}
            </LinkButton>,
            <Divider key="divider1" />,
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
                icon={<AddCircleIcon />}
                title={t('registration.new_registration')}
              />
            </LinkButtonRow>,
            <Divider key="divider2" />,
          ]}
          <LinkButton
            data-testid={dataTestId.myPage.researchProfileLink}
            isSelected={currentPath === UrlPathTemplate.MyPageResearchProfile}
            to={UrlPathTemplate.MyPageResearchProfile}
            startIcon={<img src={orcidIcon} height="20" alt={t('common.orcid')} />}>
            {t('my_page.research_profile')}
          </LinkButton>
          <Divider key="divider3" />
          <LinkButton
            data-testid={dataTestId.myPage.myProfileLink}
            isSelected={currentPath === UrlPathTemplate.MyPageMyProfile}
            to={UrlPathTemplate.MyPageMyProfile}>
            {t('my_page.my_profile.user_profile')}
          </LinkButton>
          <LinkButton
            data-testid={dataTestId.myPage.myResultsLink}
            isSelected={currentPath === UrlPathTemplate.MyPageMyResults}
            to={UrlPathTemplate.MyPageMyResults}>
            {t('my_page.my_profile.results')}
          </LinkButton>
          <LinkButtonRow>
            <LinkButton
              data-testid={dataTestId.myPage.myProjectsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyProjects}
              to={UrlPathTemplate.MyPageMyProjects}>
              {t('my_page.my_profile.projects')}
            </LinkButton>

            {user?.isCreator && (
              <LinkIconButton
                data-testid={dataTestId.myPage.createProjectButton}
                icon={<PostAddIcon />}
                isSelected={showCreateProject}
                onClick={() => setShowCreateProject(true)}
                title={t('project.create_project')}
              />
            )}
          </LinkButtonRow>
          <Divider key="divider4" />
        </NavigationList>
      </SidePanel>

      <Switch>
        <ErrorBoundary>
          <CreatorRoute exact path={UrlPathTemplate.MyPageMessages} component={MyMessagesPage} />
          <CreatorRoute exact path={UrlPathTemplate.MyPageRegistrations} component={MyRegistrations} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProfile} component={MyProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProjects} component={MyProjects} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageResearchProfile} component={ResearchProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyResults} component={MyResults} />
        </ErrorBoundary>
      </Switch>
      {user?.isCreator && <ProjectFormDialog open={showCreateProject} onClose={() => setShowCreateProject(false)} />}
    </StyledPageWithSideMenu>
  );
};

export default MyPagePage;
