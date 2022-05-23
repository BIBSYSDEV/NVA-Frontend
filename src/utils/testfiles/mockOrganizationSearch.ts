import { SearchResponse } from '../../types/common.types';
import { Organization } from '../../types/organization.types';

export const mockOrganizationSearch: SearchResponse<Organization> = {
  processingTime: 10,
  size: 1,
  hits: [
    {
      id: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
      name: {
        en: 'Sikt - Norwegian Agency for Shared Services in Education and Research',
        nb: 'Sikt – Kunnskapssektorens tjenesteleverandør',
      },
      hasPart: [
        {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.2.0.0',
          name: {
            en: 'The Research and Education Resources Division',
            nb: 'Divisjon forsknings- og kunnskapsressurser',
            nn: 'Divisjon for forskings- og kunnskapsressursar',
          },
        },
        {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.5.0.0',
          name: {
            en: 'The Corporate Governance Department',
            nb: 'Avdeling for virksomhetsstyring',
            nn: 'Avdeling for verksemdstyring',
          },
        },
        {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.1.0.0',
          name: {
            en: 'The Education and Administration Division',
            nb: 'Divisjon utdanning og administrasjon',
            nn: 'Divisjon for utdanning og administrasjon',
          },
        },
        {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.3.0.0',
          name: {
            en: 'The Organisational Development Department',
            nb: 'Divisjon data og infrastruktur',
            nn: 'Divisjon for data og infrastruktur',
          },
        },
        {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.6.0.0',
          name: {
            en: 'The Customer and Communication Department',
            nb: 'Avdeling for kunde og kommunikasjon',
            nn: 'Avdeling for kunde og kommunikasjon',
          },
        },
        {
          id: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.4.0.0',
          name: {
            en: 'The Organisational Development Department',
            nb: 'Avdeling for organisasjonsutvikling',
            nn: 'Avdeling for organisasjonsutvikling',
          },
        },
      ],
    },
  ],
};
