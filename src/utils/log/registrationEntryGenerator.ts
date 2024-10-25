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
    ...generateUnpublishedAndRepublishingEntries(registration, tickets, t),
  ];
  return entries.filter((entry) => entry !== undefined);
}

const generateUnpublishedAndRepublishingEntries = (
  registration: Registration,
  tickets: Ticket[],
  t: TFunction
): LogEntry[] => {
  const unpublishingNotes = registration.publicationNotes?.filter((note) => note.type === 'UnpublishingNote') ?? [];
  const unpublishingTickets = tickets.filter((ticket) => ticket.type === 'UnpublishRequest');

  if (unpublishingNotes.length === 0 && unpublishingTickets.length === 0) {
    return [];
  }

  const logEntries: LogEntry[] = [];

  unpublishingNotes.forEach((unpublishingNote) => {
    const unpublishLogEntry: LogEntry = {
      type: 'UnpublishRequest',
      title: t('log.titles.result_unpublished'),
      modifiedDate: unpublishingNote.createdDate,
      actions: [
        {
          actor: unpublishingNote.createdBy,
          items: [{ description: unpublishingNote.note }],
        },
      ],
    };
    logEntries.push(unpublishLogEntry);
  });

  unpublishingTickets.forEach((unpublishingTicket) => {
    const unpublishLogEntry: LogEntry = {
      type: 'UnpublishRequest',
      title: t('log.titles.result_unpublished'),
      modifiedDate: unpublishingTicket.createdDate,
      actions: [
        {
          actor: unpublishingTicket.owner,
          items: [],
        },
      ],
    };
    logEntries.push(unpublishLogEntry);
  });

  logEntries.forEach((unpublishingNote) => {
    // Assume that a newer and completed publishing ticket means that the result has been republished
    const republishingTicket = tickets.find(
      (ticket) =>
        ticket.type === 'PublishingRequest' &&
        ticket.status === 'Completed' &&
        new Date(ticket.createdDate) > new Date(unpublishingNote.modifiedDate)
    );

    if (republishingTicket) {
      const republishingLogEntry: LogEntry = {
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
      logEntries.push(republishingLogEntry);
    }
  });

  if (registration.status === 'DELETED') {
    const deletedLogEntry: LogEntry = {
      type: 'Deleted',
      title: t('log.titles.result_deleted'),
      modifiedDate: registration.modifiedDate,
      actions: [],
    };
    logEntries.push(deletedLogEntry);
  }

  return logEntries;
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
