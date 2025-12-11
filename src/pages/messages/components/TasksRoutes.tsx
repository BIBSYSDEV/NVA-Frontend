import { getNviCandidatesSearchPath, getSubUrl, UrlPathTemplate } from '../../../utils/urlPaths';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { hasCuratorRole, hasTicketCuratorRole, isNviCurator } from '../../../utils/user-helpers';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PrivateRoute } from '../../../utils/routes/Routes';
import { Navigate, Route, Routes } from 'react-router';
import { TicketListDefaultValuesWrapper } from '../../../components/TicketListDefaultValuesWrapper';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { TicketList } from './TicketList';
import { useTasksContext } from '../TasksContext';
import { useTranslation } from 'react-i18next';
import { RegistrationLandingPage } from '../../public_registration/RegistrationLandingPage';
import { NviCandidatesList } from './NviCandidatesList';
import { NviStatusPage } from './NviStatusPage';
import { NviPublicationPointsPage } from './NviPublicationPointsPage';
import { NviDisputePage } from './NviDisputePage';
import { NviCandidatePage } from './NviCandidatePage';
import { NviCorrectionList } from './NviCorrectionList';
import { PortfolioSearchPage } from '../../editor/PortfolioSearchPage';
import NotFound from '../../errorpages/NotFound';

export const TasksRoutes = () => {
  const { t } = useTranslation();
  const { ticketsQuery } = useTasksContext();
  const user = useSelector((store: RootState) => store.user);
  const userIsNviCurator = isNviCurator(user);
  const isTicketCurator = hasTicketCuratorRole(user);
  const isAnyCurator = hasCuratorRole(user);

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path={UrlPathTemplate.Root}
          element={
            <PrivateRoute
              isAuthorized={isAnyCurator}
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
          }
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksDialogue, UrlPathTemplate.Tasks)}
          element={
            <PrivateRoute
              isAuthorized={isTicketCurator}
              element={
                <TicketListDefaultValuesWrapper>
                  <TicketList ticketsQuery={ticketsQuery} title={t('tasks.user_dialog')} />
                </TicketListDefaultValuesWrapper>
              }
            />
          }
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksDialogueRegistration, UrlPathTemplate.Tasks)}
          element={<PrivateRoute element={<RegistrationLandingPage />} isAuthorized={isTicketCurator} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksNvi, UrlPathTemplate.Tasks)}
          element={<PrivateRoute element={<NviCandidatesList />} isAuthorized={userIsNviCurator} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksNviStatus, UrlPathTemplate.Tasks)}
          element={<PrivateRoute element={<NviStatusPage />} isAuthorized={userIsNviCurator} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksNviDisputes, UrlPathTemplate.Tasks)}
          element={<PrivateRoute element={<NviDisputePage />} isAuthorized={userIsNviCurator} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksPublicationPoints, UrlPathTemplate.Tasks)}
          element={<PrivateRoute element={<NviPublicationPointsPage />} isAuthorized={userIsNviCurator} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksNviCandidate, UrlPathTemplate.Tasks)}
          element={<PrivateRoute element={<NviCandidatePage />} isAuthorized={userIsNviCurator} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksNviCorrectionList, UrlPathTemplate.Tasks)}
          element={<PrivateRoute element={<NviCorrectionList />} isAuthorized={userIsNviCurator} />}
        />

        <Route
          path={getSubUrl(UrlPathTemplate.TasksResultRegistrations, UrlPathTemplate.Tasks)}
          element={
            <PrivateRoute
              element={<PortfolioSearchPage title={t('common.result_portfolio')} />}
              isAuthorized={isAnyCurator}
            />
          }
        />

        <Route path={getSubUrl(UrlPathTemplate.Tasks, UrlPathTemplate.Tasks, true)} element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};
