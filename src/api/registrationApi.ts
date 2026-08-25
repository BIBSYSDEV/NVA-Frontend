import { AxiosResponse } from 'axios';
import { ExpandedImportCandidate, ImportCandidate, ImportStatus } from '../types/importCandidate.types';
import { RegistrationLogResponse } from '../types/log.types';
import { TicketCollection, TicketStatus, TicketType } from '../types/publication_types/ticket.types';
import { DoiPreview, Registration, UpdateRegistrationStatusRequest } from '../types/registration.types';
import { isErrorStatus } from '../utils/constants';
import { makeDoiUrl } from '../utils/general-helpers';
import { doNotRedirectQueryParam } from '../utils/urlPaths';
import { PublicationsApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';
import { userIsAuthenticated } from './authApi';

export const getEtagFromResponse = (response: AxiosResponse) => response.headers['etag'] as string | undefined;

/**
 * Ensures that the registration returned from an update (PUT) carries a current ETag, in two steps:
 * the ETag of the response is merged onto the registration, and if the response has no ETag header
 * a fresh registration is fetched to obtain one.
 *
 * The ETag is only available as an HTTP header, so it must be merged onto the registration object in
 * order to survive in the client state. Without this the next update would be sent without If-Match,
 * and could silently overwrite changes made by other users.
 *
 * Intended for PUT responses only. GET responses are handled by fetchRegistration, which merges the
 * ETag itself and has no need for the refetch.
 */
const withEtagAfterUpdate = async (response: AxiosResponse<Registration>) => {
  if (isErrorStatus(response.status)) {
    return response;
  }

  const etag = getEtagFromResponse(response);
  if (etag) {
    return { ...response, data: { ...response.data, etag } };
  }

  // The response did not include an ETag header, so fetch a fresh registration to avoid losing the
  // concurrency token for subsequent updates.
  try {
    const refreshedRegistration = await fetchRegistration(response.data.identifier, true);
    return refreshedRegistration.etag && refreshedRegistration.identifier === response.data.identifier
      ? { ...response, data: refreshedRegistration }
      : response;
  } catch {
    return response;
  }
};

export const createRegistration = async (partialRegistration?: Partial<Registration>) =>
  await authenticatedApiRequest<Registration>({
    url: PublicationsApiPath.Registration,
    method: 'POST',
    data: partialRegistration,
  });

export const updateRegistration = async (registration: Registration) => {
  const { etag, ...data } = registration;
  const updateRegistrationResponse = await authenticatedApiRequest<Registration>({
    url: `${PublicationsApiPath.Registration}/${registration.identifier}`,
    method: 'PUT',
    headers: etag ? { 'If-Match': etag } : undefined,
    data,
  });
  return await withEtagAfterUpdate(updateRegistrationResponse);
};

export const partialUpdateRegistration = async (registration: Registration) => {
  const { etag, ...data } = registration;
  const partialUpdateRegistrationResponse = await authenticatedApiRequest<Registration>({
    url: `${PublicationsApiPath.Registration}/${registration.identifier}`,
    method: 'PUT',
    headers: etag ? { 'If-Match': etag } : undefined,
    data: { ...data, type: 'PartialUpdatePublicationRequest' },
  });
  return await withEtagAfterUpdate(partialUpdateRegistrationResponse);
};

export const updateRegistrationStatus = async (
  registrationIdentifier: string,
  updateRequest: UpdateRegistrationStatusRequest
) =>
  await authenticatedApiRequest2<Registration>({
    url: `${PublicationsApiPath.Registration}/${registrationIdentifier}`,
    method: 'PUT',
    data: updateRequest,
  });

export const getRegistrationByDoi = async (value: string) => {
  const getRegistrationByDoiResponse = await authenticatedApiRequest2<DoiPreview>({
    url: PublicationsApiPath.DoiLookup,
    data: { doiUrl: makeDoiUrl(value) },
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

export const publishRegistration = async (registrationId: string) =>
  await authenticatedApiRequest2<null>({
    url: `${registrationId}/publish`,
    method: 'POST',
  });

export const deleteRegistration = async (identifier: string) =>
  await authenticatedApiRequest2({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    method: 'DELETE',
  });

export const addTicketMessage = async (ticketId: string, message: string) =>
  await authenticatedApiRequest({
    url: `${ticketId}/message`,
    method: 'POST',
    data: { message },
  });

export const deleteTicketMessage = async (messageId: string) => {
  return await authenticatedApiRequest2({
    url: messageId,
    method: 'DELETE',
  });
};

export const createTicket = async (registrationId: string, type: TicketType, message?: string) => {
  return authenticatedApiRequest<null>({
    url: `${registrationId}/ticket`,
    method: 'POST',
    data:
      message && message.length > 0
        ? {
            type,
            messages: [{ type: 'Message', text: message }],
          }
        : { type },
  });
};

export const createDraftDoi = async (registrationId: string) =>
  await authenticatedApiRequest<{ doi: string }>({
    url: `${registrationId}/doi`,
    method: 'POST',
  });

export const fetchRegistration = async (registrationIdentifier: string, doNotRedirect?: boolean) => {
  const isAuthenticated = await userIsAuthenticated();

  const url = doNotRedirect
    ? `${PublicationsApiPath.Registration}/${registrationIdentifier}?${doNotRedirectQueryParam}=true`
    : `${PublicationsApiPath.Registration}/${registrationIdentifier}`;

  const fetchRegistrationResponse = isAuthenticated
    ? await authenticatedApiRequest2<Registration>({ url })
    : await apiRequest2<Registration>({ url });

  const etag = getEtagFromResponse(fetchRegistrationResponse);
  return etag ? { ...fetchRegistrationResponse.data, etag } : fetchRegistrationResponse.data;
};

export const fetchRegistrationLog = async (registrationId: string) => {
  const fetchRegistrationLogResponse = await authenticatedApiRequest2<RegistrationLogResponse>({
    url: `${registrationId}/log`,
  });
  return fetchRegistrationLogResponse.data;
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

interface UpdateTicketOwnershipData {
  type: 'UpdateTicketOwnershipRequest';
  ownerAffiliation: string;
  responsibilityArea: string;
}

export const updateTicket = async (ticketId: string, ticketData: UpdateTicketData | UpdateTicketOwnershipData) => {
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

export const createRegistrationFromImportCandidate = async (importCandidate: ExpandedImportCandidate) => {
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
