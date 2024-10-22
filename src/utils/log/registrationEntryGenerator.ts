import { TFunction } from 'i18next';
import { CristinApiPath } from '../../api/apiPaths';
import { LogEntry } from '../../types/log.types';
import { Ticket } from '../../types/publication_types/ticket.types';
import { Registration } from '../../types/registration.types';
import { SiktIdentifier } from '../constants';

export function generateRegistrationLogEntries(
  registration: Registration,
  tickets: Ticket[],
  t: TFunction
): LogEntry[] {
  const entries = [
    generateCreatedEntry(registration, t),
    generateMetadataPublishedEntry(registration, tickets, t),
    ...generateUnpublishedEntries(registration, tickets, t),
  ];
  return entries.filter((entry) => entry !== undefined);
}

const generateUnpublishedEntries = (registration: Registration, tickets: Ticket[], t: TFunction): LogEntry[] => {
  const publicationNotes = registration.publicationNotes ?? [];
  const unpublishingNotes = publicationNotes.filter((note) => note.type === 'UnpublishingNote');

  if (unpublishingNotes.length === 0) {
    return [];
  }

  const unpublishingLogEntries = unpublishingNotes.map((note) => {
    const unpublishingLogEntry: LogEntry = {
      type: 'Unpublished',
      title: t('log.titles.result_unpublished'),
      modifiedDate: note.createdDate,
      actions: [
        {
          actor: note.createdBy,
          items: [{ description: note.note }],
        },
      ],
    };
    return unpublishingLogEntry;
  });

  const completedPublishingTickets = tickets.filter(
    (ticket) => ticket.type === 'PublishingRequest' && ticket.status === 'Completed'
  );

  const republishingLogEntries: LogEntry[] = [];
  unpublishingNotes.forEach((unpublishingNote) => {
    const republishingTicket = completedPublishingTickets.find(
      (ticket) => new Date(ticket.createdDate) > new Date(unpublishingNote.createdDate)
    );

    if (republishingTicket) {
      const republihsingLogEntry: LogEntry = {
        type: 'Republished',
        title: t('log.titles.result_republished'),
        modifiedDate: republishingTicket.createdDate,
        actions: [
          {
            actor: republishingTicket.owner,
            items: [],
          },
        ],
      };
      republishingLogEntries.push(republihsingLogEntry);
    }
  });

  return [...unpublishingLogEntries, ...republishingLogEntries];
};

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
