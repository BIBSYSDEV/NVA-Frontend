import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StoreIcon from '@mui/icons-material/Store';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { VocabularySettings } from './VocabularySettings';
import { PublishStrategySettings } from './PublishStrategySettings';
import { dataTestId } from '../../utils/dataTestIds';
import { EditorRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { EditorInstitution } from './EditorInstitution';
import {
  LinkButton,
  NavigationList,
  SidePanel,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { RootState } from '../../redux/store';
import { EditorCurators } from './EditorCurators';

const EditorPage = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  useEffect(() => {
    if (currentPath === UrlPathTemplate.Editor) {
      history.replace(UrlPathTemplate.EditorInstitution);
    }
  }, [history, currentPath]);

  return (
    <StyledPageWithSideMenu>
      <SidePanel aria-labelledby="editor-title">
        <SideNavHeader text={customer?.shortName} id="editor-title" icon={StoreIcon} />

        <NavigationList>
          <LinkButton
            isSelected={currentPath === UrlPathTemplate.EditorInstitution}
            data-testid={dataTestId.editor.institutionsNameLinkButton}
            to={UrlPathTemplate.EditorInstitution}>
            {t('editor.institution.institution_name')}
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
          <LinkButton
            isSelected={currentPath === UrlPathTemplate.EditorCurators}
            data-testid={dataTestId.editor.areaOfResponsibilityLinkButton}
            to={UrlPathTemplate.EditorCurators}>
            {t('editor.curators.areas_of_responsibility')}
          </LinkButton>
        </NavigationList>
      </SidePanel>
      <BackgroundDiv>
        <Switch>
          <EditorRoute exact path={UrlPathTemplate.EditorVocabulary} component={VocabularySettings} />
          <EditorRoute exact path={UrlPathTemplate.EditorPublishStrategy} component={PublishStrategySettings} />
          <EditorRoute exact path={UrlPathTemplate.EditorInstitution} component={EditorInstitution} />
          <EditorRoute exact path={UrlPathTemplate.EditorCurators} component={EditorCurators} />
        </Switch>
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default EditorPage;
