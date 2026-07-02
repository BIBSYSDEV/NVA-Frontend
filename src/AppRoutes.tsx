import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from './api/searchApi';
import { Layout } from './Layout';
import NotFound from './pages/errorpages/NotFound';
import { RootState } from './redux/store';
import { PrivateRoute } from './utils/routes/Routes';
import { getNviCandidatesSearchPath, UrlPathTemplate } from './utils/urlPaths';
import { checkUserRoles } from './utils/user-helpers';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const FrontPage = lazy(() => import('./pages/frontpage/FrontPage'));
const BasicDataPage = lazy(() => import('./pages/basic-data/BasicDataPage'));
const AdminCustomerInstitutionsContainer = lazy(
  () => import('./pages/basic_data/app_admin/AdminCustomerInstitutionsContainer')
);
const CentralImportPage = lazy(() => import('./pages/basic_data/app_admin/central_import/CentralImportPage'));
const CentralImportDuplicationCheckPage = lazy(
  () => import('./pages/basic_data/app_admin/central_import/CentralImportDuplicationCheckPage')
);
const CentralImportCandidateForm = lazy(
  () => import('./pages/basic_data/app_admin/central_import/CentralImportCandidateForm')
);
const MergeImportCandidate = lazy(() => import('./components/merge_results/MergeImportCandidate'));
const AddEmployeePage = lazy(() => import('./pages/basic_data/institution_admin/AddEmployeePage'));
const PersonRegisterPage = lazy(
  () => import('./pages/basic_data/institution_admin/person_register/PersonRegisterPage')
);
const NviPeriodsPage = lazy(() => import('./pages/basic-data/nvi/reporting-periods/NviPeriodsPage'));
const NviAdminReportingStatusPage = lazy(() => import('./pages/basic-data/nvi/status/NviAdminReportingStatusPage'));
const NviAdminPublicationPointsPage = lazy(
  () => import('./pages/basic-data/nvi/publication-points/NviAdminPublicationPointsPage')
);
const PublisherClaimsSettings = lazy(() => import('./pages/editor/PublisherClaimsSettings'));
const SerialPublicationClaimsSettings = lazy(() => import('./pages/editor/SerialPublicationClaimsSettings'));
const EditorPage = lazy(() => import('./pages/editor/InstitutionPage'));
const EditRegistration = lazy(() => import('./pages/registration/new_registration/EditRegistration'));
const CopyrightActTerms = lazy(() => import('./pages/infopages/CopyrightActTerms'));
const CreateProject = lazy(() => import('./pages/project/project_wizard/CreateProject'));
const EditProject = lazy(() => import('./pages/project/project_wizard/EditProject'));
const PublicRegistration = lazy(() => import('./pages/public_registration/PublicRegistration'));
const MyPagePage = lazy(() => import('./pages/my_page/MyPagePage'));
const PublicResearchProfile = lazy(() => import('./pages/research_profile/PublicResearchProfile'));
const TasksPage = lazy(() => import('./pages/tasks/TasksPage'));
const SignedOutPage = lazy(() => import('./pages/infopages/SignedOutPage'));
const ProjectPage = lazy(() => import('./pages/projects/ProjectPage'));
const Logout = lazy(() => import('./layout/Logout'));
const LoginPage = lazy(() => import('./layout/LoginPage'));
const SearchPage = lazy(() => import('./pages/search/SearchPage'));
const AdvancedSearchPage = lazy(() => import('./pages/search/advanced_search/AdvancedSearchPage'));
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'));
const NviReports = lazy(() => import('./pages/reports/NviReports'));
const InternationalCooperationReports = lazy(() => import('./pages/reports/InternationalCooperationReports'));
const ClinicalTreatmentStudiesReports = lazy(() => import('./pages/reports/ClinicalTreatmentStudiesReports'));
const TasksDialoguePage = lazy(() => import('./pages/tasks/dialogue/TasksDialoguePage'));
const RegistrationLandingPage = lazy(() => import('./components/registration-landing-page/RegistrationLandingPage'));
const NviCandidatesListPage = lazy(() => import('./pages/tasks/nvi/NviCandidatesListPage'));
const NviReportingStatusPage = lazy(() => import('./pages/tasks/nvi/status/NviReportingStatusPage'));
const NviDisputePage = lazy(() => import('./pages/messages/components/NviDisputePage'));
const NviPublicationPointsPage = lazy(() => import('./pages/tasks/nvi/publication-points/NviPublicationPointsPage'));
const NviCandidatePage = lazy(() => import('./pages/tasks/nvi/nvi-candidate-page/NviCandidatePage'));
const NviCorrectionList = lazy(() => import('./pages/messages/components/NviCorrectionList'));
const PortfolioSearchPage = lazy(() => import('./pages/editor/PortfolioSearchPage'));

export const AppRoutes = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const isAuthenticated = !!user;
  const hasCustomerId = isAuthenticated && !!user.customerId;
  const {
    isEditor,
    isCreator,
    isCurator,
    isNviCurator,
    isTicketCurator,
    isInstitutionAdmin,
    isAppAdmin,
    isInternalImporter,
  } = checkUserRoles(user);
  const canSeeBasicData = isAppAdmin || isInstitutionAdmin || isInternalImporter;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={UrlPathTemplate.Root} element={<FrontPage />} />
        <Route element={<Dashboard />}>
          <Route path={UrlPathTemplate.Filter} element={<SearchPage />} />
          <Route path={UrlPathTemplate.Search} element={<AdvancedSearchPage />} />
          <Route path={UrlPathTemplate.Reports} element={<ReportsPage />} />
          <Route path={UrlPathTemplate.ReportsNvi} element={<NviReports />} />
          <Route path={UrlPathTemplate.ReportsInternationalCooperation} element={<InternationalCooperationReports />} />
          <Route path={UrlPathTemplate.ReportsClinicalTreatmentStudies} element={<ClinicalTreatmentStudiesReports />} />
        </Route>

        <Route path={UrlPathTemplate.CopyrightAct} element={<CopyrightActTerms />} />
        <Route path={UrlPathTemplate.ResearchProfile} element={<PublicResearchProfile />} />
        <Route path={UrlPathTemplate.RegistrationLandingPage} element={<PublicRegistration />} />
        <Route path={UrlPathTemplate.ProjectPage} element={<ProjectPage />} />
        <Route path={UrlPathTemplate.Login} element={<LoginPage />} />
        <Route path={UrlPathTemplate.Logout} element={<Logout />} />
        <Route path={UrlPathTemplate.SignedOut} element={<SignedOutPage />} />

        {/* Authenticated routes */}
        <Route
          path={`${UrlPathTemplate.MyPage}/*`}
          element={<PrivateRoute element={<MyPagePage />} isAuthorized={isAuthenticated} />}
        />

        {/* Creator routes */}
        <Route
          path={UrlPathTemplate.RegistrationWizard}
          element={<PrivateRoute isAuthorized={isCreator || isCurator || isEditor} element={<EditRegistration />} />}
        />
        <Route
          path={UrlPathTemplate.RegistrationNew}
          element={<PrivateRoute isAuthorized={isCreator} element={<EditRegistration />} />}
        />
        <Route
          path={UrlPathTemplate.ProjectsEdit}
          element={<PrivateRoute isAuthorized={isCreator} element={<EditProject />} />}
        />
        <Route
          path={UrlPathTemplate.ProjectsNew}
          element={<PrivateRoute isAuthorized={isCreator} element={<CreateProject />} />}
        />

        {/* Curator routes */}
        <Route
          path={UrlPathTemplate.Tasks}
          element={<PrivateRoute isAuthorized={isCurator || isNviCurator} element={<TasksPage />} />}>
          <Route
            index
            element={
              isTicketCurator ? (
                <Navigate to={UrlPathTemplate.TasksDialogue} replace />
              ) : (
                <Navigate
                  to={getNviCandidatesSearchPath({
                    username: user?.nvaUsername,
                    status: NviCandidateStatusEnum.Pending,
                    globalStatus: NviCandidateGlobalStatusEnum.Pending,
                  })}
                  replace
                />
              )
            }
          />
          <Route
            path={UrlPathTemplate.TasksDialogue}
            element={<PrivateRoute isAuthorized={isTicketCurator} element={<TasksDialoguePage />} />}
          />
          <Route
            path={UrlPathTemplate.TasksDialogueRegistration}
            element={<PrivateRoute element={<RegistrationLandingPage />} isAuthorized={isTicketCurator} />}
          />
          <Route
            path={UrlPathTemplate.TasksNvi}
            element={<PrivateRoute element={<NviCandidatesListPage />} isAuthorized={isNviCurator} />}
          />
          <Route
            path={UrlPathTemplate.TasksNviStatus}
            element={<PrivateRoute element={<NviReportingStatusPage />} isAuthorized={isNviCurator} />}
          />
          <Route
            path={UrlPathTemplate.TasksNviDisputes}
            element={<PrivateRoute element={<NviDisputePage />} isAuthorized={isNviCurator} />}
          />
          <Route
            path={UrlPathTemplate.TasksPublicationPoints}
            element={<PrivateRoute element={<NviPublicationPointsPage />} isAuthorized={isNviCurator} />}
          />
          <Route
            path={UrlPathTemplate.TasksNviCandidate}
            element={<PrivateRoute element={<NviCandidatePage />} isAuthorized={isNviCurator} />}
          />
          <Route
            path={UrlPathTemplate.TasksNviCorrectionList}
            element={<PrivateRoute element={<NviCorrectionList />} isAuthorized={isNviCurator} />}
          />
          <Route
            path={UrlPathTemplate.TasksResultRegistrations}
            element={
              <PrivateRoute
                element={<PortfolioSearchPage title={t('common.result_portfolio')} />}
                isAuthorized={isCurator || isNviCurator}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Basic Data routes */}
        <Route
          path={UrlPathTemplate.BasicData}
          element={<PrivateRoute isAuthorized={canSeeBasicData} element={<BasicDataPage />} />}>
          <Route
            index
            element={
              <PrivateRoute
                isAuthorized={canSeeBasicData}
                element={
                  isInstitutionAdmin ? (
                    <Navigate to={UrlPathTemplate.BasicDataPersonRegister} replace />
                  ) : isAppAdmin ? (
                    <Navigate to={UrlPathTemplate.BasicDataInstitutions} replace />
                  ) : (
                    <Navigate to={UrlPathTemplate.BasicDataCentralImport} replace />
                  )
                }
              />
            }
          />
          <Route
            path={UrlPathTemplate.BasicDataInstitutions}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<AdminCustomerInstitutionsContainer />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataCentralImport}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataCentralImportCandidate}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportDuplicationCheckPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataCentralImportCandidateWizard}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<CentralImportCandidateForm />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataCentralImportCandidateMerge}
            element={<PrivateRoute isAuthorized={isInternalImporter} element={<MergeImportCandidate />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataAddEmployee}
            element={<PrivateRoute isAuthorized={isInstitutionAdmin} element={<AddEmployeePage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataPersonRegister}
            element={<PrivateRoute isAuthorized={isInstitutionAdmin} element={<PersonRegisterPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataNviStatus}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<NviAdminReportingStatusPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataNviPublicationPoints}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<NviAdminPublicationPointsPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataNvi}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<NviPeriodsPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataNviNew}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<NviPeriodsPage />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataPublisherClaims}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<PublisherClaimsSettings />} />}
          />
          <Route
            path={UrlPathTemplate.BasicDataSerialPublicationClaims}
            element={<PrivateRoute isAuthorized={isAppAdmin} element={<SerialPublicationClaimsSettings />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Institution routes */}
        <Route
          path={`${UrlPathTemplate.Institution}/*`}
          element={<PrivateRoute isAuthorized={hasCustomerId} element={<EditorPage />} />}
        />

        {/* Wildcard path must be last, otherwise it will catch all routes */}
        <Route path={UrlPathTemplate.Wildcard} element={<NotFound />} />
      </Route>
    </Routes>
  );
};
