import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from '@mui/material';
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {user?.isCreator && [
            <Accordion
              elevation={0}
              expanded={currentPath === UrlPathTemplate.MyPageMessages}
              sx={{
                '&.MuiAccordion-root.Mui-expanded': {
                  margin: 0,
                },
                bgcolor: 'secondary.dark',
              }}>
              <AccordionSummary
                onClick={() =>
                  !currentPath.startsWith(UrlPathTemplate.MyPageMessages) &&
                  history.push(UrlPathTemplate.MyPageMessages)
                }
                expandIcon={<ExpandMoreIcon color="primary" />}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}>
                  <ChatBubbleIcon fontSize="small" />
                  <Typography variant="h3" fontWeight={500}>
                    {t('my_page.messages.messages')}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingX: 0, margin: 0 }}>
                <NavigationList>
                  <LinkButton
                    key={dataTestId.myPage.messagesLink}
                    data-testid={dataTestId.myPage.messagesLink}
                    isSelected={currentPath === UrlPathTemplate.MyPageMessages}
                    to={UrlPathTemplate.MyPageMessages}>
                    {t('my_page.messages.messages')}
                  </LinkButton>
                </NavigationList>
              </AccordionDetails>
            </Accordion>,

            <Accordion
              elevation={0}
              expanded={currentPath === UrlPathTemplate.MyPageRegistrations}
              sx={{
                '&.MuiAccordion-root.Mui-expanded': {
                  margin: 0,
                },
                bgcolor: 'secondary.dark',
              }}>
              <AccordionSummary
                sx={{
                  '&.MuiAccordionSummary-content': {
                    paddingY: 0,
                  },
                }}
                onClick={() =>
                  !currentPath.startsWith(UrlPathTemplate.MyPageRegistrations) &&
                  history.push(UrlPathTemplate.MyPageRegistrations)
                }
                expandIcon={<ExpandMoreIcon color="primary" />}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}>
                  <AddIcon fontSize="small" />
                  <Typography variant="h3" fontWeight={500}>
                    {t('common.registrations')}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingX: 0, margin: 0 }}>
                <NavigationList>
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
                  </LinkButtonRow>
                </NavigationList>
              </AccordionDetails>
            </Accordion>,

            <Accordion
              elevation={0}
              expanded={currentPath === UrlPathTemplate.MyPageMyProjectRegistrations}
              sx={{
                '&.MuiAccordion-root.Mui-expanded': {
                  margin: 0,
                },
                bgcolor: 'secondary.dark',
              }}>
              <AccordionSummary
                onClick={() =>
                  !currentPath.startsWith(UrlPathTemplate.MyPageMyProjectRegistrations) &&
                  history.push(UrlPathTemplate.MyPageMyProjectRegistrations)
                }
                expandIcon={<ExpandMoreIcon color="primary" />}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}>
                  <AddIcon sx={{ bgcolor: 'project.main', borderRadius: '50%' }} fontSize="small" />
                  <Typography variant="h3" fontWeight={500}>
                    {t('my_page.project_registrations')}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingX: 0, margin: 0 }}>
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
              </AccordionDetails>
            </Accordion>,
          ]}
          <Accordion
            elevation={0}
            expanded={currentPath === UrlPathTemplate.MyPageResearchProfile}
            sx={{
              '&.MuiAccordion-root.Mui-expanded': {
                margin: 0,
              },
              bgcolor: 'secondary.dark',
            }}>
            <AccordionSummary
              onClick={() =>
                !currentPath.startsWith(UrlPathTemplate.MyPageResearchProfile) &&
                history.push(UrlPathTemplate.MyPageResearchProfile)
              }
              expandIcon={<ExpandMoreIcon color="primary" />}>
              <Box
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}>
                <img src={orcidIcon} height="20" alt={t('common.orcid')} />

                <Typography variant="h3" fontWeight={500}>
                  {t('my_page.research_profile')}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingX: 0, margin: 0 }}>
              <NavigationList>
                <LinkButton
                  data-testid={dataTestId.myPage.researchProfileLink}
                  isSelected={currentPath === UrlPathTemplate.MyPageResearchProfile}
                  to={UrlPathTemplate.MyPageResearchProfile}>
                  {t('my_page.research_profile')}
                </LinkButton>
              </NavigationList>
            </AccordionDetails>
          </Accordion>

          <Accordion
            elevation={0}
            expanded={
              currentPath === UrlPathTemplate.MyPageMyProfile ||
              currentPath === UrlPathTemplate.MyPageMyResults ||
              currentPath === UrlPathTemplate.MyPageMyProjects
            }
            sx={{
              '&.MuiAccordion-root.Mui-expanded': {
                margin: 0,
              },
              bgcolor: 'secondary.dark',
            }}>
            <AccordionSummary
              onClick={() =>
                !currentPath.startsWith(UrlPathTemplate.MyPageMyProfile) &&
                history.push(UrlPathTemplate.MyPageMyProfile)
              }
              expandIcon={<ExpandMoreIcon color="primary" />}>
              <Box
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}>
                <PersonIcon fontSize="small" />
                <Typography variant="h3" fontWeight={500}>
                  {t('my_page.my_profile.user_profile')}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingX: 0, margin: 0 }}>
              <NavigationList>
                <LinkButton
                  data-testid={dataTestId.myPage.myProfileLink}
                  isSelected={currentPath === UrlPathTemplate.MyPageMyProfile}
                  to={UrlPathTemplate.MyPageMyProfile}>
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
            </AccordionDetails>
          </Accordion>
        </Box>
      </SidePanel>

      <Switch>
        <ErrorBoundary>
          <CreatorRoute exact path={UrlPathTemplate.MyPageMessages} component={MyMessagesPage} />
          <CreatorRoute exact path={UrlPathTemplate.MyPageRegistrations} component={MyRegistrations} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProfile} component={MyProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProjects} component={MyProjects} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageResearchProfile} component={ResearchProfile} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyResults} component={MyResults} />
          <LoggedInRoute exact path={UrlPathTemplate.MyPageMyProjectRegistrations} component={MyProjectRegistrations} />
        </ErrorBoundary>
      </Switch>
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
