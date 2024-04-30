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
import { EditorDoi } from './EditorDoi';
import { EditorInstitution } from './EditorInstitution';
import { InstitutionSupport } from './InstitutionSupport';
import { OrganizationOverview } from './OrganizationOverview';
import { PublishStrategySettings } from './PublishStrategySettings';
import { PublishingStrategyOverview } from './PublishingStrategyOverview';
import { VocabularyOverview } from './VocabularyOverview';
import { VocabularySettings } from './VocabularySettings';
import { OrganizationCurators } from './curators/OrganizationCurators';

const InstitutionPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const hasCustomer = !!user?.customerId;
  const isEditor = hasCustomer && user.isEditor;

  const institutionId = user?.topOrgCristinId ?? '';

  const organizationQuery = useQuery({
    enabled: !!institutionId,
    queryKey: [institutionId],
    queryFn: () => getById<Organization>(institutionId),
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
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
          accordionPath={UrlPathTemplate.InstitutionOverview}
          defaultPath={UrlPathTemplate.InstitutionOverviewPage}>
          <NavigationList>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.InstitutionOverviewPage}
              data-testid={dataTestId.editor.institutionsNameLinkButton}
              to={UrlPathTemplate.InstitutionOverviewPage}>
              {t('editor.institution.institution_profile')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.InstitutionOrganizationOverview}
              data-testid={dataTestId.editor.organizationOverviewLinkButton}
              to={UrlPathTemplate.InstitutionOrganizationOverview}>
              {t('editor.organization_overview')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.InstitutionCuratorsOverview}
              data-testid={dataTestId.editor.curatorsOverviewLinkButton}
              to={UrlPathTemplate.InstitutionCuratorsOverview}>
              {t('editor.curators.curators')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.InstitutionDoi}
              data-testid={dataTestId.editor.doiLinkButton}
              to={UrlPathTemplate.InstitutionDoi}>
              {t('common.doi_long')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.InstitutionPublishStrategyOverview}
              data-testid={dataTestId.editor.publishStrategyOverviewLinkButton}
              to={UrlPathTemplate.InstitutionPublishStrategyOverview}>
              {t('editor.publish_strategy.publish_strategy')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.InstitutionVocabularyOverview}
              data-testid={dataTestId.editor.vocabularyOverviewLinkButton}
              to={UrlPathTemplate.InstitutionVocabularyOverview}>
              {t('editor.vocabulary')}
            </LinkButton>
            <LinkButton
              isSelected={currentPath === UrlPathTemplate.InstitutionCategoriesOverview}
              data-testid={dataTestId.editor.categoriesLinkButton}
              to={UrlPathTemplate.InstitutionCategoriesOverview}>
              {t('editor.categories_with_files')}
            </LinkButton>
          </NavigationList>
        </NavigationListAccordion>
        {isEditor && (
          <NavigationListAccordion
            dataTestId={dataTestId.editor.settingsAccordion}
            title={t('common.settings')}
            startIcon={<GavelIcon sx={{ bgcolor: 'white', padding: '0.1rem' }} />}
            accordionPath={UrlPathTemplate.InstitutionSettings}
            defaultPath={UrlPathTemplate.InstitutionCurators}>
            <NavigationList>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.InstitutionCurators}
                data-testid={dataTestId.editor.curatorsSettingsLinkButton}
                to={UrlPathTemplate.InstitutionCurators}>
                {t('editor.curators.administer_curators')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.InstitutionPublishStrategy}
                data-testid={dataTestId.editor.publishStrategyLinkButton}
                to={UrlPathTemplate.InstitutionPublishStrategy}>
                {t('editor.publish_strategy.publish_strategy')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.InstitutionVocabulary}
                data-testid={dataTestId.editor.vocabularyLinkButton}
                to={UrlPathTemplate.InstitutionVocabulary}>
                {t('editor.vocabulary')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.InstitutionCategories}
                data-testid={dataTestId.editor.categoriesLinkButton}
                to={UrlPathTemplate.InstitutionCategories}>
                {t('editor.categories_with_files')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.InstitutionSupport}
                data-testid={dataTestId.editor.supportLinkButton}
                to={UrlPathTemplate.InstitutionSupport}>
                {t('editor.institution.change_institution_support')}
              </LinkButton>
            </NavigationList>
          </NavigationListAccordion>
        )}
      </SideMenu>
      <BackgroundDiv>
        <Switch>
          <PrivateRoute
            exact
            path={UrlPathTemplate.InstitutionVocabulary}
            component={VocabularySettings}
            isAuthorized={isEditor}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.InstitutionVocabularyOverview}
            component={VocabularyOverview}
            isAuthorized={hasCustomer}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.InstitutionPublishStrategy}
            component={PublishStrategySettings}
            isAuthorized={isEditor}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.InstitutionPublishStrategyOverview}
            component={PublishingStrategyOverview}
            isAuthorized={hasCustomer}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.InstitutionOverviewPage}
            component={EditorInstitution}
            isAuthorized={hasCustomer}
          />
          <PrivateRoute exact path={UrlPathTemplate.InstitutionCuratorsOverview} isAuthorized={hasCustomer}>
            <OrganizationCurators heading={t('editor.curators.curators')} />
          </PrivateRoute>
          <PrivateRoute exact path={UrlPathTemplate.InstitutionCurators} isAuthorized={isEditor}>
            <OrganizationCurators heading={t('editor.curators.administer_curators')} canEditUsers />
          </PrivateRoute>
          <PrivateRoute exact path={UrlPathTemplate.InstitutionDoi} component={EditorDoi} isAuthorized={hasCustomer} />
          <PrivateRoute
            exact
            path={UrlPathTemplate.InstitutionCategories}
            component={CategoriesWithFiles}
            isAuthorized={isEditor}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.InstitutionCategoriesOverview}
            component={CategoriesWithFilesOverview}
            isAuthorized={hasCustomer}
          />
          <PrivateRoute
            exact
            path={UrlPathTemplate.InstitutionOrganizationOverview}
            component={OrganizationOverview}
            isAuthorized={hasCustomer}
          />
          <PrivateRoute
            path={UrlPathTemplate.InstitutionSupport}
            component={InstitutionSupport}
            isAuthorized={isEditor}
          />
          <PrivateRoute path={UrlPathTemplate.Wildcard} component={NotFound} isAuthorized={isEditor} />
        </Switch>
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default InstitutionPage;
