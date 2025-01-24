import { ImportCandidate, ImportStatus } from '../types/importCandidate.types';
import { TicketCollection, TicketStatus, TicketType } from '../types/publication_types/ticket.types';
import {
  DoiPreview,
  MyRegistrationsResponse,
  Registration,
  UpdateRegistrationStatusRequest,
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

export const updateRegistrationStatus = async (
  registrationIdentifier: string,
  updateRequest: UpdateRegistrationStatusRequest
) =>
  await authenticatedApiRequest2<Registration>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}`,
    method: 'PUT',
    data: updateRequest,
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

export const deleteTicketMessage = async (ticketId: string, messageId: string) => {
  return await authenticatedApiRequest2({
    url: `${ticketId}/message/${messageId}`,
    method: 'DELETE',
  });
};

export const createTicket = async (registrationId: string, type: TicketType, message?: string) => {
  return authenticatedApiRequest<null>({
    url: `${registrationId}/ticket`,
    method: 'POST',
    data: message && message.length > 0 ? { type, messages: [{ type: 'Message', text: message }] } : { type },
  });
};

export const createDraftDoi = async (registrationId: string) =>
  await authenticatedApiRequest<{ doi: string }>({
    url: `${registrationId}/doi`,
    method: 'POST',
  });

export const doNotRedirectQueryParam = 'doNotRedirect';

export const fetchRegistration = async (registrationIdentifier: string, doNotRedirect?: boolean) => {
  const isAuthenticated = await userIsAuthenticated();

  const url = doNotRedirect
    ? `${PublicationsApiPath.Registration}/${registrationIdentifier}?${doNotRedirectQueryParam}=true`
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
