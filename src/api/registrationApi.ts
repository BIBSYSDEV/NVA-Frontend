import { Doi, Registration } from '../types/registration.types';
import { apiRequest2, authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';
import { Ticket, TicketCollection, TicketStatus, TicketType } from '../types/publication_types/ticket.types';
import { PublicationsApiPath } from './apiPaths';
import { ImportCandidate } from '../types/importCandidate.types';

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

export const getRegistrationByDoi = async (doiUrl: string) =>
  await authenticatedApiRequest<Doi>({
    url: `${PublicationsApiPath.DoiLookup}/`,
    data: { doiUrl },
    method: 'POST',
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

export const fetchRegistration = async (registrationIdentifier: string) => {
  const fetchRegistrationResponse = await apiRequest2<Registration>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}`,
  });
  return fetchRegistrationResponse.data;
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
  viewStatus?: string;
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
