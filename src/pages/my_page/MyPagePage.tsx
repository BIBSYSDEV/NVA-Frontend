import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useQueryClient } from '@tanstack/react-query';
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
import { MyProjectRegistrations } from './user_profile/MyProjectRegistrations';
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
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import NotFound from '../errorpages/NotFound';

const MyPagePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = useSelector((store: RootState) => store.user);
  const queryClient = useQueryClient();

  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const [showCreateProject, setShowCreateProject] = useState(false);

  useEffect(() => {
    if (currentPath === UrlPathTemplate.MyPage) {
      if (user?.isCreator) {
        history.replace(UrlPathTemplate.MyPageMyMessages);
      } else {
        history.replace(UrlPathTemplate.MyPageMyResearchProfile);
      }
    }
  }, [history, currentPath, user?.isCreator]);

  return (
    <StyledPageWithSideMenu>
      <SidePanel aria-labelledby="my-page-title">
        <SideNavHeader icon={FavoriteBorderIcon} text={t('my_page.my_page')} id="my-page-title" />

        {user?.isCreator && [
          <NavigationListAccordion
            key={dataTestId.myPage.messagesAccordion}
            dataTestId={dataTestId.myPage.messagesAccordion}
            title={t('my_page.messages.messages')}
            startIcon={<ChatBubbleIcon fontSize="small" />}
            accordionPath={UrlPathTemplate.MyPageMessages}
            defaultPath={UrlPathTemplate.MyPageMyMessages}>
            <NavigationList>
              <LinkButton
                key={dataTestId.myPage.messagesLink}
                data-testid={dataTestId.myPage.messagesLink}
                isSelected={currentPath === UrlPathTemplate.MyPageMyMessages}
                to={UrlPathTemplate.MyPageMyMessages}>
                {t('my_page.messages.messages')}
              </LinkButton>
            </NavigationList>
          </NavigationListAccordion>,

          <NavigationListAccordion
            key={dataTestId.myPage.registrationsAccordion}
            title={t('common.registrations')}
            startIcon={<AddIcon fontSize="small" />}
            accordionPath={UrlPathTemplate.MyPageRegistrations}
            defaultPath={UrlPathTemplate.MyPageMyRegistrations}
            dataTestId={dataTestId.myPage.registrationsAccordion}>
            <NavigationList>
              <LinkButtonRow key={dataTestId.myPage.myRegistrationsLink}>
                <LinkButton
                  data-testid={dataTestId.myPage.myRegistrationsLink}
                  isSelected={currentPath === UrlPathTemplate.MyPageMyRegistrations}
                  to={UrlPathTemplate.MyPageMyRegistrations}>
                  {t('common.registrations')}
                </LinkButton>
                <LinkIconButton
                  data-testid={dataTestId.myPage.newRegistrationLink}
                  to={UrlPathTemplate.RegistrationNew}
                  icon={<AddCircleIcon />}
                  title={t('registration.new_registration')}
                />
              </LinkButtonRow>
            </NavigationList>
          </NavigationListAccordion>,

          <NavigationListAccordion
            key={dataTestId.myPage.projectRegistrationsAccordion}
            title={t('my_page.project_registrations')}
            startIcon={<AddIcon sx={{ bgcolor: 'project.main' }} fontSize="small" />}
            accordionPath={UrlPathTemplate.MyPageProjectRegistrations}
            defaultPath={UrlPathTemplate.MyPageMyProjectRegistrations}
            dataTestId={dataTestId.myPage.projectRegistrationsAccordion}>
            <NavigationList>
              <LinkButtonRow key={dataTestId.myPage.myProjectRegistrationsLink}>
                <LinkButton
                  data-testid={dataTestId.myPage.myProjectRegistrationsLink}
                  isSelected={currentPath === UrlPathTemplate.MyPageMyProjectRegistrations}
                  to={UrlPathTemplate.MyPageMyProjectRegistrations}>
                  {t('my_page.project_registrations')}
                </LinkButton>

                <LinkIconButton
                  data-testid={dataTestId.myPage.createProjectButton}
                  icon={<PostAddIcon />}
                  isSelected={showCreateProject}
                  onClick={() => setShowCreateProject(true)}
                  title={t('project.create_project')}
                />
              </LinkButtonRow>
            </NavigationList>
          </NavigationListAccordion>,
        ]}
        <NavigationListAccordion
          key={dataTestId.myPage.researchProfileAccordion}
          title={t('my_page.research_profile')}
          startIcon={<img src={orcidIcon} height="20" alt={t('common.orcid')} />}
          accordionPath={UrlPathTemplate.MyPageResearchProfile}
          defaultPath={UrlPathTemplate.MyPageMyResearchProfile}
          dataTestId={dataTestId.myPage.researchProfileAccordion}>
          <NavigationList>
            <LinkButton
              data-testid={dataTestId.myPage.researchProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyResearchProfile}
              to={UrlPathTemplate.MyPageMyResearchProfile}>
              {t('my_page.research_profile')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>

        <NavigationListAccordion
          key={dataTestId.myPage.myProfileAccordion}
          title={t('my_page.my_profile.user_profile')}
          startIcon={<PersonIcon fontSize="small" />}
          accordionPath={UrlPathTemplate.MyPageMyProfile}
          defaultPath={UrlPathTemplate.MyPageMyPersonalia}
          dataTestId={dataTestId.myPage.myProfileAccordion}>
          <NavigationList>
            <LinkButton
              data-testid={dataTestId.myPage.myProfileLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyPersonalia}
              to={UrlPathTemplate.MyPageMyPersonalia}>
              {t('my_page.my_profile.heading.personalia')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.myPage.myResultsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyResults}
              to={UrlPathTemplate.MyPageMyResults}>
              {t('my_page.my_profile.results')}
            </LinkButton>
            <LinkButton
              data-testid={dataTestId.myPage.myProjectsLink}
              isSelected={currentPath === UrlPathTemplate.MyPageMyProjects}
              to={UrlPathTemplate.MyPageMyProjects}>
              {t('my_page.my_profile.projects')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>
      </SidePanel>

      <ErrorBoundary>
        <Switch>
          <CreatorRoute exact path={UrlPathTemplate.MyPageMyMessages} component={MyMessagesPage} />
          <CreatorRoute exact path={UrlPathTemplate.MyPageMyRegistrations} component={MyRegistrations} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyPersonalia} component={MyProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProjects} component={MyProjects} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyResearchProfile} component={ResearchProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyResults} component={MyResults} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProjectRegistrations} component={MyProjectRegistrations} />
          <LoggedInRoute exact path={UrlPathTemplate.Wildcard} component={NotFound} />
        </Switch>
      </ErrorBoundary>
      {user?.isCreator && (
        <ProjectFormDialog
          open={showCreateProject}
          onClose={() => setShowCreateProject(false)}
          onCreateProject={async () => {
            await new Promise((resolve) => setTimeout(resolve, 10_000));
            // Wait 10sec before refetching projects, and hope that it is indexed by then
            // TODO: consider placing the new project in the cache manually instead of a fixed waiting time
            queryClient.invalidateQueries({ queryKey: ['projects'] });
          }}
        />
      )}
    </StyledPageWithSideMenu>
  );
};

export default MyPagePage;
