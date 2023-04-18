import { Doi, Registration } from '../types/registration.types';
import { apiRequest2, authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';
import { Ticket, TicketCollection, TicketStatus, TicketType } from '../types/publication_types/messages.types';
import { PublicationsApiPath } from './apiPaths';

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

export const updateTicketStatus = async (ticketId: string, type: TicketType, status: TicketStatus) =>
  await authenticatedApiRequest({
    url: ticketId,
    method: 'PUT',
    data: { type, status },
  });

export const createDraftDoi = async (registrationId: string) =>
  await authenticatedApiRequest<{ doi: string }>({
    url: `${registrationId}/doi`,
    method: 'POST',
  });

export const fetchRegistration = async (registrationId: string) => {
  const getRegistration = await apiRequest2<Registration>({
    url: registrationId,
  });
  return getRegistration.data;
};

export const fetchRegistrationTickets = async (registrationId: string) => {
  const getTickets = await authenticatedApiRequest2<TicketCollection>({
    url: `${registrationId}/tickets`,
  });
  return getTickets.data;
};
