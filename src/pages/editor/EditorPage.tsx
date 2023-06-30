import { useTranslation } from 'react-i18next';
import { Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StoreIcon from '@mui/icons-material/Store';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import GavelIcon from '@mui/icons-material/Gavel';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { VocabularySettings } from './VocabularySettings';
import { PublishStrategySettings } from './PublishStrategySettings';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { EditorInstitution } from './EditorInstitution';
import { LinkButton, NavigationList, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { RootState } from '../../redux/store';
import { EditorCurators } from './EditorCurators';
import { EditorDoi } from './EditorDoi';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import NotFound from '../../pages/errorpages/NotFound';
import { SideMenu } from '../../components/SideMenu';

const EditorPage = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);
  const user = useSelector((store: RootState) => store.user);
  const isEditor = !!user?.customerId && user.isEditor;

  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  return (
    <StyledPageWithSideMenu>
      <SideMenu>
        <SideNavHeader text={customer?.shortName} icon={StoreIcon} />
        <NavigationListAccordion
          dataTestId={dataTestId.editor.overviewAccordion}
          title={t('common.overview')}
          startIcon={
            <ArchitectureIcon
              sx={{
                bgcolor: 'white',
              }}
            />
          }
          accordionPath={UrlPathTemplate.EditorOverview}
          defaultPath={UrlPathTemplate.EditorCurators}>
          <NavigationList>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorCurators}
              data-testid={dataTestId.editor.areaOfResponsibilityLinkButton}
              to={UrlPathTemplate.EditorCurators}>
              {t('editor.curators.areas_of_responsibility')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>

        <NavigationListAccordion
          dataTestId={dataTestId.editor.settingsAccordion}
          title={t('common.settings')}
          startIcon={
            <GavelIcon
              sx={{
                bgcolor: 'white',
                padding: '0.1rem',
              }}
            />
          }
          accordionPath={UrlPathTemplate.EditorSettings}
          defaultPath={UrlPathTemplate.EditorInstitution}>
          <NavigationList>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorInstitution}
              data-testid={dataTestId.editor.institutionsNameLinkButton}
              to={UrlPathTemplate.EditorInstitution}>
              {t('editor.institution.institution_name')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorDoi}
              data-testid={dataTestId.editor.doiLinkButton}
              to={UrlPathTemplate.EditorDoi}>
              {t('common.doi_long')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorVocabulary}
              data-testid={dataTestId.editor.vocabularyLinkButton}
              to={UrlPathTemplate.EditorVocabulary}>
              {t('editor.vocabulary')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorPublishStrategy}
              data-testid={dataTestId.editor.publishStrategyLinkButton}
              to={UrlPathTemplate.EditorPublishStrategy}>
              {t('editor.publish_strategy.publish_strategy')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>
      </SideMenu>
      <BackgroundDiv>
        <Switch>
          <PrivateRoute
            exact
            path={UrlPathTemplate.EditorVocabulary}
            component={VocabularySettings}
            isAuthorized={isEditor}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.EditorPublishStrategy}
            component={PublishStrategySettings}
            isAuthorized={isEditor}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.EditorInstitution}
            component={EditorInstitution}
            isAuthorized={isEditor}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.EditorCurators}
            component={EditorCurators}
            isAuthorized={isEditor}
          />
          <PrivateRoute exact path={UrlPathTemplate.EditorDoi} component={EditorDoi} isAuthorized={isEditor} />
          <PrivateRoute path={UrlPathTemplate.Wildcard} component={NotFound} isAuthorized={isEditor} />
        </Switch>
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default EditorPage;
