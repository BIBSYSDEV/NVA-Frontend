import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { VocabularySettings } from './VocabularySettings';
import { PublishStrategySettings } from './PublishStrategySettings';
import { EditorRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { EditorInstitution } from './EditorInstitution';
import {
  LinkButton,
  NavigationList,
  SideNav,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { RootState } from '../../redux/store';
import { AreaOfResponsibility } from './AreaOfResponsibility';

const EditorPage = () => {
  const { t } = useTranslation();
  const customerShortName = useSelector((store: RootState) => store.user?.customerShortName);
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  useEffect(() => {
    if (currentPath === UrlPathTemplate.Editor) {
      history.replace(UrlPathTemplate.EditorInstitution);
    }
  }, [history, currentPath]);

  return (
    <StyledPageWithSideMenu>
      <SideNav aria-labelledby="editor-title">
        <SideNavHeader text={customerShortName} id="editor-title" />

        <NavigationList>
          <LinkButton
            isSelected={currentPath === UrlPathTemplate.EditorInstitution}
            to={UrlPathTemplate.EditorInstitution}>
            {t('editor.institution.institution_name')}
          </LinkButton>
          <LinkButton
            isSelected={currentPath === UrlPathTemplate.EditorVocabulary}
            to={UrlPathTemplate.EditorVocabulary}>
            {t('editor.vocabulary')}
          </LinkButton>
          <LinkButton
            isSelected={currentPath === UrlPathTemplate.EditorPublishStrategy}
            to={UrlPathTemplate.EditorPublishStrategy}>
            {t('editor.publish_strategy.publish_strategy')}
          </LinkButton>
          <LinkButton
            isSelected={currentPath === UrlPathTemplate.EditorAreaOfResponsibility}
            to={UrlPathTemplate.EditorAreaOfResponsibility}>
            {t('basic_data.users.area_of_responsibility')}
          </LinkButton>
        </NavigationList>
      </SideNav>
      <BackgroundDiv>
        <Switch>
          <EditorRoute exact path={UrlPathTemplate.EditorVocabulary} component={VocabularySettings} />
          <EditorRoute exact path={UrlPathTemplate.EditorPublishStrategy} component={PublishStrategySettings} />
          <EditorRoute exact path={UrlPathTemplate.EditorInstitution} component={EditorInstitution} />
          <EditorRoute exact path={UrlPathTemplate.EditorAreaOfResponsibility} component={AreaOfResponsibility} />
        </Switch>
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default EditorPage;
