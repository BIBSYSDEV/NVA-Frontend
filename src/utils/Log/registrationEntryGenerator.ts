import { TFunction } from 'i18next';
import { LogEntry } from '../../types/log.types';
import { Registration } from '../../types/registration.types';

// TODO: Denne filen skal erstattes når kun tickets brukes som kilde for logginnslag

export function generateRegistrationLogEntries(registration: Registration, t: TFunction): LogEntry[] {
  const entries = [generateCreatedEntry(registration, t), generatePublishedEntry(registration, t)];
  return entries.filter((entry) => entry !== undefined);
}

function generateCreatedEntry(registration: Registration, t: TFunction): LogEntry {
  return {
    type: 'PublishingRequest',
    title: t('log.titles.created'),
    modifiedDate: registration.createdDate,
    actions: [
      {
        actor: registration.resourceOwner.owner,
        items: [
          {
            description: t('log.created_in_nva'),
            date: registration.createdDate,
          },
        ],
      },
    ],
  };
}

function generatePublishedEntry(registration: Registration, t: TFunction): LogEntry | undefined {
  if (!registration.publishedDate) {
    return;
  }

  return {
    type: 'PublishingRequest',
    title: t('log.titles.metadata_published'),
    modifiedDate: registration.publishedDate,
    actions: [
      {
        items: [
          {
            description: t('log.metadata_published_in_nva'),
            date: registration.publishedDate,
          },
        ],
      },
    ],
  };
}
