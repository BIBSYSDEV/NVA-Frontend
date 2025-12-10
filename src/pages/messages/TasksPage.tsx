import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import {
  fetchCustomerTickets,
  FetchTicketsParams,
  NviCandidateGlobalStatusEnum,
  NviCandidateStatusEnum,
  SortOrder,
  TicketOrderBy,
  TicketSearchParam,
} from '../../api/searchApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { TicketListDefaultValuesWrapper } from '../../components/TicketListDefaultValuesWrapper';
import { RootState } from '../../redux/store';
import { TicketTypeSelection } from '../../types/publication_types/ticket.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { PrivateRoute } from '../../utils/routes/Routes';
import { getNviCandidatesSearchPath, getSubUrl, UrlPathTemplate } from '../../utils/urlPaths';
import { PortfolioSearchPage } from '../editor/PortfolioSearchPage';
import NotFound from '../errorpages/NotFound';
import { RegistrationLandingPage } from '../public_registration/RegistrationLandingPage';
import { NviCandidatePage } from './components/NviCandidatePage';
import { NviCandidatesList } from './components/NviCandidatesList';
import { NviCorrectionList } from './components/NviCorrectionList';
import { NviStatusPage } from './components/NviStatusPage';
import { TicketList } from './components/TicketList';
import { NviDisputePage } from './components/NviDisputePage';
import { NviPublicationPointsPage } from './components/NviPublicationPointsPage';
import { TasksSideMenu } from './components/TasksSideMenu';

const TasksPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const user = useSelector((store: RootState) => store.user);
  const isSupportCurator = !!user?.isSupportCurator;
  const isDoiCurator = !!user?.isDoiCurator;
  const isPublishingCurator = !!user?.isPublishingCurator;
  const isThesisCurator = !!user?.isThesisCurator;
  const isTicketCurator = isSupportCurator || isDoiCurator || isPublishingCurator || isThesisCurator;
  const isNviCurator = !!user?.isNviCurator;
  const isAnyCurator = isTicketCurator || isNviCurator;

  const isOnTicketsPage = location.pathname === UrlPathTemplate.TasksDialogue;

  const institutionUserQuery = useFetchUserQuery(user?.nvaUsername ?? '');

  const searchParams = new URLSearchParams(location.search);

  const [ticketTypes] = useState<TicketTypeSelection>({
    doiRequest: isDoiCurator,
    generalSupportCase: isSupportCurator,
    publishingRequest: isPublishingCurator,
    filesApprovalThesis: isThesisCurator,
  });

  const selectedTicketTypes = Object.entries(ticketTypes)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  const organizationIdParam = searchParams.get(TicketSearchParam.OrganizationId);

  const ticketSearchParams: FetchTicketsParams = {
    aggregation: 'all',
    query: searchParams.get(TicketSearchParam.Query),
    results: Number(searchParams.get(TicketSearchParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
    from: Number(searchParams.get(TicketSearchParam.From) ?? 0),
    orderBy: searchParams.get(TicketSearchParam.OrderBy) as TicketOrderBy | null,
    sortOrder: searchParams.get(TicketSearchParam.SortOrder) as SortOrder | null,
    organizationId: organizationIdParam,
    excludeSubUnits: searchParams.get(TicketSearchParam.ExcludeSubUnits) === 'true',
    assignee: searchParams.get(TicketSearchParam.Assignee),
    status: searchParams.get(TicketSearchParam.Status),
    type: selectedTicketTypes.join(','),
    viewedByNot: searchParams.get(TicketSearchParam.ViewedByNot),
    createdDate: searchParams.get(TicketSearchParam.CreatedDate),
    publicationType: searchParams.get(TicketSearchParam.PublicationType),
  };

  const ticketsQuery = useQuery({
    enabled: isOnTicketsPage && !institutionUserQuery.isPending,
    queryKey: ['tickets', ticketSearchParams],
    queryFn: () => fetchCustomerTickets(ticketSearchParams),
    meta: { errorMessage: t('feedback.error.get_messages') },
  });

  return (
    <StyledPageWithSideMenu>
      <TasksSideMenu />
      <Outlet />
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
            element={<PrivateRoute element={<NviCandidatesList />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviStatus, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviStatusPage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviDisputes, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviDisputePage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksPublicationPoints, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviPublicationPointsPage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviCandidate, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviCandidatePage />} isAuthorized={isNviCurator} />}
          />

          <Route
            path={getSubUrl(UrlPathTemplate.TasksNviCorrectionList, UrlPathTemplate.Tasks)}
            element={<PrivateRoute element={<NviCorrectionList />} isAuthorized={isNviCurator} />}
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
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
