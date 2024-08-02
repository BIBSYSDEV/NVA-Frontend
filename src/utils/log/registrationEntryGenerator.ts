import { TFunction } from 'i18next';
import { SiktIdentifier } from '../constants';
import { CristinApiPath } from '../../api/apiPaths';
import { LogEntry } from '../../types/log.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';

export function generateRegistrationLogEntries(
  registration: Registration,
  tickets: Ticket[],
  t: TFunction
): LogEntry[] {
  const entries = [generateCreatedEntry(registration, t), generateMetadataPublishedEntry(registration, tickets, t)];
  return entries.filter((entry) => entry !== undefined);
}

function generateMetadataPublishedEntry(
  registration: Registration,
  tickets: Ticket[],
  t: TFunction
): LogEntry | undefined {
  const firstPublishingTicket = tickets.filter((ticket) => ticket.type === 'PublishingRequest')[0];
  if (firstPublishingTicket && !registrationIsCreatedByImport(registration)) {
    // Assumption: Regardless of ticket status, if there exists publishing ticket(s), the first will be metadata published
    return {
      type: 'MetadataPublished',
      title: t('log.titles.metadata_published_in_nva'),
      modifiedDate: firstPublishingTicket.createdDate,
      actions: [
        {
          actor: firstPublishingTicket.owner,
          items: [],
        },
      ],
    };
  }

  // If there is no publishing tickets, we still might have a publishedDate, for example when there is an import
  if (registration.publishedDate) {
    return {
      type: 'MetadataPublished',
      title: t('log.titles.metadata_published'),
      modifiedDate: registration.publishedDate,
      actions: [],
    };
  }
}

function generateCreatedEntry(registration: Registration, t: TFunction): LogEntry {
  return {
    type: 'Created',
    title: t('log.titles.created_in_nva'),
    modifiedDate: registration.createdDate,
    actions: [
      {
        ...generateActorAndOrganizationBasedOnImport(registration),
        items: [],
      },
    ],
  };
}

function generateActorAndOrganizationBasedOnImport(registration: Registration) {
  if (registrationIsCreatedByImport(registration)) {
    return {
      actor: undefined,
      organization: `${CristinApiPath.Organization}/${SiktIdentifier}`,
    };
  }

  return {
    actor: registration.resourceOwner.owner,
    organization: undefined,
  };
}

function registrationIsCreatedByImport(registration: Registration) {
  return (
    registration.importDetails?.some((importDetail) => importDetail.importDate === registration.createdDate) ?? false
  );
}
