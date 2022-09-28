import { Doi, Registration } from '../types/registration.types';
import { authenticatedApiRequest } from './apiRequest';
import { Ticket, TicketStatus, TicketType } from '../types/publication_types/messages.types';
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

export const createTicket = async (registrationId: string, type: TicketType) =>
  await authenticatedApiRequest<Ticket>({
    url: `${registrationId}/ticket`,
    method: 'POST',
    data: { type },
  });

export const updateTicketStatus = async (ticketId: string, status: TicketStatus) =>
  await authenticatedApiRequest({
    url: `${ticketId}/status`, // TODO: Update path
    method: 'POST',
    data: { status },
  });
