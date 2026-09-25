import { dataTestId } from '../../src/utils/dataTestIds';
import { mockRegistration } from '../../src/utils/testfiles/mockRegistration';
import { getRegistrationLandingPagePath, UrlPathTemplate } from '../../src/utils/urlPaths';

export interface A11yRoute {
  /** Key into a11yBaseline. Stays stable even if the URL changes. */
  snapshot: string;
  template: UrlPathTemplate;
  path: string;
  /**
   * Must be visible before axe runs, so a skeleton is never scanned. This, not a
   * retry, is the fix for the race between cy.visit and data loading.
   */
  readySelector: string;
}

const byTestId = (testId: string) => `[data-testid=${testId}]`;

export const publicA11yRoutes: A11yRoute[] = [
  {
    snapshot: 'frontpage',
    template: UrlPathTemplate.Root,
    path: UrlPathTemplate.Root,
    readySelector: byTestId(dataTestId.frontPage.searchInputField),
  },
  {
    snapshot: 'search-filter',
    template: UrlPathTemplate.Filter,
    path: UrlPathTemplate.Filter,
    readySelector: byTestId(dataTestId.startPage.searchResultItem),
  },
  {
    snapshot: 'search-advanced',
    template: UrlPathTemplate.Search,
    path: UrlPathTemplate.Search,
    readySelector: byTestId(dataTestId.startPage.searchField),
  },
  {
    snapshot: 'registration-landing-page',
    template: UrlPathTemplate.RegistrationLandingPage,
    path: getRegistrationLandingPagePath(mockRegistration.identifier),
    // The landing page's accordions are all conditional on data, so the page
    // heading is the only reliable readiness signal.
    readySelector: 'h1',
  },
];

/**
 * Authenticated routes reachable by URL. Empty for now: the mock login lives only
 * in Redux and does not survive the reload a cy.visit causes, so authenticated
 * screens are covered by dedicated specs that navigate through the UI instead.
 */
export const authenticatedA11yRoutes: A11yRoute[] = [];

/**
 * Routes that will never be swept, and why. Additions here need a real reason —
 * this is not a parking space for routes that are merely inconvenient.
 */
export const permanentlyUncoveredA11yTemplates: Partial<Record<UrlPathTemplate, string>> = {
  [UrlPathTemplate.Login]: 'Redirects to Cognito, not our markup',
  [UrlPathTemplate.Logout]: 'Redirect only, renders no UI',
  [UrlPathTemplate.Wildcard]: 'Covered by the not-found snapshot',
};

/**
 * Routes covered by a dedicated spec that navigates through the UI rather than by
 * the route table above, because a cy.visit would drop the mock login.
 */
export const coveredByDedicatedSpecA11yTemplates: Partial<Record<UrlPathTemplate, string>> = {
  [UrlPathTemplate.RegistrationWizard]: 'a11y_registration_wizard.spec.ts',
};

/**
 * Routes not yet swept. This list is the remaining accessibility debt in route
 * terms and is meant to shrink: moving an entry into publicA11yRoutes or
 * authenticatedA11yRoutes is the unit of progress.
 *
 * It exists so the guard test still fails for genuinely new routes rather than
 * being disabled wholesale while coverage is built up.
 */
export const notYetSweptA11yTemplates: UrlPathTemplate[] = [
  // Registration wizard
  UrlPathTemplate.RegistrationNew,
  // My page
  UrlPathTemplate.MyPage,
  UrlPathTemplate.MyPageResults,
  UrlPathTemplate.MyPageMessages,
  UrlPathTemplate.MyPageFieldAndBackground,
  UrlPathTemplate.MyPageMyMessages,
  UrlPathTemplate.MyPageMyMessagesRegistration,
  UrlPathTemplate.MyPageProfile,
  UrlPathTemplate.MyPagePersonalia,
  UrlPathTemplate.MyPageMyProjectRegistrations,
  UrlPathTemplate.MyPageMyProjects,
  UrlPathTemplate.MyPageResearchProfile,
  UrlPathTemplate.MyPageProjectRegistrations,
  UrlPathTemplate.MyPageTerms,
  UrlPathTemplate.MyPageMyRegistrations,
  UrlPathTemplate.MyPageUserRoleAndHelp,
  // Tasks / NVI curation
  UrlPathTemplate.Tasks,
  UrlPathTemplate.TasksDialogue,
  UrlPathTemplate.TasksDialogueRegistration,
  UrlPathTemplate.TasksNvi,
  UrlPathTemplate.TasksNviCandidate,
  UrlPathTemplate.TasksNviCorrectionList,
  UrlPathTemplate.TasksNviStatus,
  UrlPathTemplate.TasksNviDisputes,
  UrlPathTemplate.TasksPublicationPoints,
  UrlPathTemplate.TasksResultRegistrations,
  // Projects
  UrlPathTemplate.ProjectsRoot,
  UrlPathTemplate.ProjectsNew,
  UrlPathTemplate.ProjectPage,
  UrlPathTemplate.ProjectsEdit,
  // Research profile
  UrlPathTemplate.ResearchProfile,
  UrlPathTemplate.ResearchProfileRoot,
  // Reports
  UrlPathTemplate.Reports,
  UrlPathTemplate.ReportsClinicalTreatmentStudies,
  UrlPathTemplate.ReportsInternationalCooperation,
  UrlPathTemplate.ReportsNvi,
  // Basic data (admin)
  UrlPathTemplate.BasicData,
  UrlPathTemplate.BasicDataAddEmployee,
  UrlPathTemplate.BasicDataCentralImport,
  UrlPathTemplate.BasicDataCentralImportCandidate,
  UrlPathTemplate.BasicDataCentralImportCandidateWizard,
  UrlPathTemplate.BasicDataCentralImportCandidateMerge,
  UrlPathTemplate.BasicDataInstitutions,
  UrlPathTemplate.BasicDataNvi,
  UrlPathTemplate.BasicDataNviPublicationPoints,
  UrlPathTemplate.BasicDataNviStatus,
  UrlPathTemplate.BasicDataNviNew,
  UrlPathTemplate.BasicDataPersonRegister,
  UrlPathTemplate.BasicDataChannelClaims,
  UrlPathTemplate.BasicDataPublisherClaims,
  UrlPathTemplate.BasicDataSerialPublicationClaims,
  // Institution (admin)
  UrlPathTemplate.Institution,
  UrlPathTemplate.InstitutionCurators,
  UrlPathTemplate.InstitutionCuratorsOverview,
  UrlPathTemplate.InstitutionDoi,
  UrlPathTemplate.InstitutionOverviewPage,
  UrlPathTemplate.InstitutionSupport,
  UrlPathTemplate.InstitutionOrganizationOverview,
  UrlPathTemplate.InstitutionOverview,
  UrlPathTemplate.InstitutionNviPublicationPoints,
  UrlPathTemplate.InstitutionNviReportingStatus,
  UrlPathTemplate.InstitutionPortfolio,
  UrlPathTemplate.InstitutionPublishStrategy,
  UrlPathTemplate.InstitutionPublishStrategyOverview,
  UrlPathTemplate.InstitutionSettings,
  UrlPathTemplate.InstitutionVocabulary,
  UrlPathTemplate.InstitutionVocabularyOverview,
  UrlPathTemplate.InstitutionCategories,
  UrlPathTemplate.InstitutionCategoriesOverview,
  UrlPathTemplate.InstitutionPublisherClaimsOverview,
  UrlPathTemplate.InstitutionSerialPublicationClaimsOverview,
  // Other
  UrlPathTemplate.CopyrightAct,
  UrlPathTemplate.SignedOut,
];

export const isA11yTemplateExcused = (template: UrlPathTemplate) =>
  template in permanentlyUncoveredA11yTemplates ||
  template in coveredByDedicatedSpecA11yTemplates ||
  notYetSweptA11yTemplates.includes(template);
