import { TFunction } from 'i18next';
import { CristinApiPath } from '../../api/apiPaths';
import { LogEntry } from '../../types/log.types';
import { Registration } from '../../types/registration.types';

// TODO: Denne filen skal erstattes når kun tickets brukes som kilde for logginnslag

export function generateRegistrationLogEntries(registration: Registration, t: TFunction): LogEntry[] {
  const entries = [generateCreatedEntry(registration, t), generatePublishedEntry(registration, t)];
  return entries.filter((entry) => entry !== undefined);
}

function generateCreatedEntry(registration: Registration, t: TFunction): LogEntry {
  return {
    type: 'Created',
    title: t('log.titles.created'),
    modifiedDate: registration.createdDate,
    actions: [
      {
        ...generateActorAndOrganizationBasedOnImport(registration),
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
    type: 'MetadataPublished',
    title: t('log.titles.metadata_published'),
    modifiedDate: registration.publishedDate,
    actions: [
      {
        ...generateActorAndOrganizationBasedOnImport(registration),
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

function generateActorAndOrganizationBasedOnImport(registration: Registration) {
  if (registrationCreatedByImport(registration)) {
    return {
      actor: undefined,
      organization: `${CristinApiPath.Organization}/20754.0.0.0`,
    };
  }

  return {
    actor: registration.resourceOwner.owner,
    organization: undefined,
  };
}

// TODO: Burde man sette granularitet til minutt?
function registrationCreatedByImport(registration: Registration) {
  return registration.importDetails?.some((importDetail) => importDetail.importDate === registration.createdDate);
}
