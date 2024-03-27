import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import GavelIcon from '@mui/icons-material/Gavel';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router-dom';
import { getById } from '../../api/commonApi';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { LinkButton, NavigationList, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SideMenu } from '../../components/SideMenu';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import NotFound from '../../pages/errorpages/NotFound';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PrivateRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { CategoriesWithFiles } from './CategoriesWithFiles';
import { CategoriesWithFilesOverview } from './CategoriesWithFilesOverview';
import { EditorCurators } from './EditorCurators';
import { EditorDoi } from './EditorDoi';
import { EditorInstitution } from './EditorInstitution';
import { OrganizationOverview } from './OrganizationOverview';
import { PublishStrategySettings } from './PublishStrategySettings';
import { VocabularySettings } from './VocabularySettings';
import { VocabularyOverview } from './VocabularyOverview';

const EditorPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const hasCustomer = !!user?.customerId;
  const isEditor = hasCustomer && user.isEditor;

  const institutionId = user?.topOrgCristinId ?? '';

  const organizationQuery = useQuery({
    queryKey: [institutionId],
    queryFn: () => getById<Organization>(institutionId),
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  return (
    <StyledPageWithSideMenu>
      <SideMenu>
        <SideNavHeader text={organizationQuery.data?.acronym} icon={AccountBalanceIcon} />
        <NavigationListAccordion
          dataTestId={dataTestId.editor.overviewAccordion}
          title={t('editor.institution.organizing')}
          startIcon={
            <ArchitectureIcon
              sx={{
                bgcolor: 'white',
              }}
            />
          }
          accordionPath={UrlPathTemplate.EditorOverview}
          defaultPath={UrlPathTemplate.EditorInstitution}>
          <NavigationList>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorInstitution}
              data-testid={dataTestId.editor.institutionsNameLinkButton}
              to={UrlPathTemplate.EditorInstitution}>
              {t('editor.institution.institution_profile')}
            </LinkButton>

            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorOrganizationOverview}
              data-testid={dataTestId.editor.organizationOverviewLinkButton}
              to={UrlPathTemplate.EditorOrganizationOverview}>
              {t('editor.organization_overview')}
            </LinkButton>

            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorDoi}
              data-testid={dataTestId.editor.doiLinkButton}
              to={UrlPathTemplate.EditorDoi}>
              {t('common.doi_long')}
            </LinkButton>

            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorVocabularyOverview}
              data-testid={dataTestId.editor.vocabularyOverviewLinkButton}
              to={UrlPathTemplate.EditorVocabularyOverview}>
              {t('editor.vocabulary')}
            </LinkButton>

            <LinkButton
              isSelected={currentPath === UrlPathTemplate.EditorCategoriesOverview}
              data-testid={dataTestId.editor.categoriesLinkButton}
              to={UrlPathTemplate.EditorCategoriesOverview}>
              {t('editor.categories_with_files')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>
        {isEditor && (
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
            defaultPath={UrlPathTemplate.EditorCurators}>
            <NavigationList>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorCurators}
                data-testid={dataTestId.editor.areaOfResponsibilityLinkButton}
                to={UrlPathTemplate.EditorCurators}>
                {t('editor.curators.areas_of_responsibility')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorPublishStrategy}
                data-testid={dataTestId.editor.publishStrategyLinkButton}
                to={UrlPathTemplate.EditorPublishStrategy}>
                {t('editor.publish_strategy.publish_strategy')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorVocabulary}
                data-testid={dataTestId.editor.vocabularyLinkButton}
                to={UrlPathTemplate.EditorVocabulary}>
                {t('editor.vocabulary')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorCategories}
                data-testid={dataTestId.editor.categoriesLinkButton}
                to={UrlPathTemplate.EditorCategories}>
                {t('editor.categories_with_files')}
              </LinkButton>
            </NavigationList>
          </NavigationListAccordion>
        )}
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
            path={UrlPathTemplate.EditorVocabularyOverview}
            component={VocabularyOverview}
            isAuthorized={hasCustomer}
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
            isAuthorized={hasCustomer}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.EditorCurators}
            component={EditorCurators}
            isAuthorized={isEditor}
          />
          <PrivateRoute exact path={UrlPathTemplate.EditorDoi} component={EditorDoi} isAuthorized={hasCustomer} />
          <PrivateRoute
            exact
            path={UrlPathTemplate.EditorCategories}
            component={CategoriesWithFiles}
            isAuthorized={isEditor}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.EditorCategoriesOverview}
            component={CategoriesWithFilesOverview}
            isAuthorized={hasCustomer}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.EditorOrganizationOverview}
            component={OrganizationOverview}
            isAuthorized={hasCustomer}
          />
          <PrivateRoute path={UrlPathTemplate.Wildcard} component={NotFound} isAuthorized={isEditor} />
        </Switch>
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default EditorPage;
