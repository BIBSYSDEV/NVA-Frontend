import { ImportCandidate, ImportStatus } from '../types/importCandidate.types';
import { Ticket, TicketCollection, TicketStatus, TicketType } from '../types/publication_types/ticket.types';
import {
  DoiPreview,
  MyRegistrationsResponse,
  Registration,
  UnpublishPublicationRequest,
} from '../types/registration.types';
import { PublicationsApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';
import { userIsAuthenticated } from './authApi';

export const createRegistration = async (partialRegistration?: Partial<Registration>) =>
  await authenticatedApiRequest<Registration>({
    url: PublicationsApiPath.Registration,
    method: 'POST',
    data: partialRegistration,
  });

export const updateRegistration = async (registration: Registration) =>
  await authenticatedApiRequest<Registration>({
    url: `${PublicationsApiPath.Registration}/${registration.identifier}`,
    method: 'PUT',
    data: registration,
  });

export const unpublishRegistration = async (
  registrationIdentifier: string,
  unpublishingRequest: UnpublishPublicationRequest
) =>
  await authenticatedApiRequest2<Registration>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}`,
    method: 'PUT',
    data: unpublishingRequest,
  });

export const getRegistrationByDoi = async (doiUrl: string) => {
  const getRegistrationByDoiResponse = await authenticatedApiRequest2<DoiPreview>({
    url: PublicationsApiPath.DoiLookup,
    data: { doiUrl },
    method: 'POST',
  });

  return getRegistrationByDoiResponse.data;
};

export const createRegistrationFromDoi = async (doiPreview: Partial<DoiPreview>) =>
  await authenticatedApiRequest2<Registration>({
    url: PublicationsApiPath.Registration,
    method: 'POST',
    data: doiPreview,
  });

export const deleteRegistration = async (identifier: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    method: 'DELETE',
  });

export const addTicketMessage = async (ticketId: string, message: string) =>
  await authenticatedApiRequest({
    url: `${ticketId}/message`,
    method: 'POST',
    data: { message },
  });

export const createTicket = async (registrationId: string, type: TicketType, returnCreatedTicket = false) => {
  const createTicketResponse = await authenticatedApiRequest<null>({
    url: `${registrationId}/ticket`,
    method: 'POST',
    data: { type },
  });

  // Must handle redirects manually since the browser denies the app access to the response's location header
  if (!returnCreatedTicket) {
    return createTicketResponse;
  } else {
    const getTickets = await authenticatedApiRequest<TicketCollection>({
      url: `${registrationId}/tickets`,
    });
    const createdTicketId =
      getTickets.data.tickets
        .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1))
        .find((ticket) => ticket.type === type)?.id ?? '';
    return await authenticatedApiRequest<Ticket>({
      url: createdTicketId,
    });
  }
};

export const createDraftDoi = async (registrationId: string) =>
  await authenticatedApiRequest<{ doi: string }>({
    url: `${registrationId}/doi`,
    method: 'POST',
  });

export const fetchRegistration = async (registrationIdentifier: string, shouldNotRedirect?: boolean) => {
  const isAuthenticated = await userIsAuthenticated();

  const url = shouldNotRedirect
    ? `${PublicationsApiPath.Registration}/${registrationIdentifier}?doNotRedirect=true`
    : `${PublicationsApiPath.Registration}/${registrationIdentifier}`;

  const fetchRegistrationResponse = isAuthenticated
    ? await authenticatedApiRequest2<Registration>({ url })
    : await apiRequest2<Registration>({ url });

  return fetchRegistrationResponse.data;
};

export const fetchRegistrationsByOwner = async () => {
  const fetchRegistrationsByOwnerResponse = await authenticatedApiRequest2<MyRegistrationsResponse>({
    url: PublicationsApiPath.RegistrationsByOwner,
  });
  return fetchRegistrationsByOwnerResponse.data;
};
export const fetchRegistrationTickets = async (registrationId: string) => {
  const getTickets = await authenticatedApiRequest2<TicketCollection>({
    url: `${registrationId}/tickets`,
  });
  return getTickets.data;
};

export interface UpdateTicketData {
  assignee?: string;
  status?: TicketStatus;
  viewStatus?: 'Read' | 'Unread';
}

export const updateTicket = async (ticketId: string, ticketData: UpdateTicketData) => {
  const updateTicket = await authenticatedApiRequest2<null>({
    url: ticketId,
    method: 'PUT',
    data: ticketData,
  });
  return updateTicket.data;
};

export const fetchImportCandidate = async (importCandidateIdentifier: string) => {
  const fetchImportCandidateResponse = await apiRequest2<ImportCandidate>({
    url: `${PublicationsApiPath.ImportCandidate}/${importCandidateIdentifier}`,
  });
  return fetchImportCandidateResponse.data;
};

export const createRegistrationFromImportCandidate = async (importCandidate: ImportCandidate) => {
  const createRegistrationResponse = await authenticatedApiRequest2<Registration>({
    url: `${PublicationsApiPath.ImportCandidate}/${importCandidate.identifier}`,
    method: 'POST',
    data: importCandidate,
  });
  return createRegistrationResponse.data;
};

export const updateImportCandidateStatus = async (
  importCandidateIdentifier: string,
  importStatus: Partial<ImportStatus>
) => {
  const updateImportCandidateStatusResponse = await authenticatedApiRequest2<ImportCandidate>({
    url: `${PublicationsApiPath.ImportCandidate}/${importCandidateIdentifier}`,
    method: 'PUT',
    data: importStatus,
  });

  return updateImportCandidateStatusResponse.data;
};
