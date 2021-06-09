import { VocabularyData } from '../../types/vocabulary.types';

export const hrcsActivities: VocabularyData = {
  '@context': {
    '@vocab': 'http://www.w3.org/2004/02/skos/core#',
    id: '@id',
    type: '@type',
    categories: '@graph',
    HrcsConcept: 'Concept',
    subcategories: 'narrower',
    label: {
      '@id': 'prefLabel',
      '@container': '@language',
    },
    identifier: 'http://purl.org/dc/terms/identifier',
  },
  categories: [
    {
      id: 'https://nva.unit.no/hrcs/1',
      type: 'HrcsConcept',
      identifier: '1',
      label: {
        en: 'Underpinning Research',
        nb: 'Underbyggende Forskning',
      },
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/1.1',
          type: 'HrcsConcept',
          identifier: '1.1',
          label: {
            en: 'Normal biological development and functioning',
            nb: 'Normal biologisk utvikling og funksjon',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/1.2',
          type: 'HrcsConcept',
          identifier: '1.2',
          label: {
            en: 'Psychological and socioeconomic processes',
            nb: 'Psykologiske og sosioøkonomiske prosesser',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/1.3',
          type: 'HrcsConcept',
          identifier: '1.3',
          label: {
            en: 'Chemical and physical sciences',
            nb: 'Kjemiske og fysiske vitenskaper',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/1.4',
          type: 'HrcsConcept',
          identifier: '1.4',
          label: {
            en: 'Methodologies and measurements',
            nb: 'Metodologi og målinger',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/1.5',
          type: 'HrcsConcept',
          identifier: '1.5',
          label: {
            en: 'Resources and infrastructure (underpinning) ',
            nb: 'Ressurser og infrastruktur (underbyggende)',
          },
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/2',
      type: 'HrcsConcept',
      identifier: '2',
      label: {
        en: 'Aetiology',
        nb: 'Årsaksforhold',
      },
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/2.1',
          type: 'HrcsConcept',
          identifier: '2.1',
          label: {
            en: 'Biological and endogenous factors',
            nb: 'Biologiske og indre faktorer',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/2.2',
          type: 'HrcsConcept',
          identifier: '2.2',
          label: {
            en: 'Factors relating to physical environment',
            nb: 'Faktorer knyttet til fysisk miljø',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/2.3',
          type: 'HrcsConcept',
          identifier: '2.3',
          label: {
            en: 'Psychological, social and economic factors',
            nb: 'Psykologiske, sosiale og økonomiske faktorer',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/2.4',
          type: 'HrcsConcept',
          identifier: '2.4',
          label: {
            en: 'Surveillance and distribution',
            nb: 'Overvåking og utbredelse',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/2.5',
          type: 'HrcsConcept',
          identifier: '2.5',
          label: {
            en: 'Research design and methodologies (aetiology) ',
            nb: 'Forskningsdesign og metodologi (årsaksforhold)',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/2.6',
          type: 'HrcsConcept',
          identifier: '2.6',
          label: {
            en: 'Resources and infrastructure (aetiology) ',
            nb: 'Ressurser og infrastruktur (årsaksforhold)',
          },
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/3',
      type: 'HrcsConcept',
      identifier: '3',
      label: {
        en: 'Prevention of Disease and Conditions, and Promotion of Well-Being',
        nb: 'Sykdomsforebyggende og helsefremmende tiltak, og fremme av velvære',
      },
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/3.1',
          type: 'HrcsConcept',
          identifier: '3.1',
          label: {
            en: 'Primary prevention interventions to modify behaviours or promote well-being',
            nb: 'Primærforebyggende tiltak for å endre atferd eller fremme helse',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/3.2',
          type: 'HrcsConcept',
          identifier: '3.2',
          label: {
            en: 'Interventions to alter physical and biological environmental risks',
            nb: 'Intervensjoner for å endre fysisk og biologisk miljørisiko',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/3.3',
          type: 'HrcsConcept',
          identifier: '3.3',
          label: {
            en: 'Nutrition and chemoprevention',
            nb: 'Ernæring og kjemoprevensjon',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/3.4',
          type: 'HrcsConcept',
          identifier: '3.4',
          label: {
            en: 'Vaccines',
            nb: 'Vaksiner',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/3.5',
          type: 'HrcsConcept',
          identifier: '3.5',
          label: {
            en: 'Resources and infrastructure (prevention) ',
            nb: 'Ressurser og infrastruktur (sykdomsforebyggende og helsefremmende tiltak)',
          },
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/4',
      type: 'HrcsConcept',
      identifier: '4',
      label: {
        en: 'Detection, Screening and Diagnosis',
        nb: 'Påvising, screening og diagnose',
      },
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/4.1',
          type: 'HrcsConcept',
          identifier: '4.1',
          label: {
            en: 'Discovery and preclinical testing of markers and technologies',
            nb: 'Oppdaging og preklinisk testing av markører og teknologier',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/4.2',
          type: 'HrcsConcept',
          identifier: '4.2',
          label: {
            en: 'Evaluation of markers and technologies',
            nb: 'Evaluering av markører og teknologier',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/4.3',
          type: 'HrcsConcept',
          identifier: '4.3',
          label: {
            en: 'Influences and impact',
            nb: 'Innflytelse og påvirkningskraft',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/4.4',
          type: 'HrcsConcept',
          identifier: '4.4',
          label: {
            en: 'Population screening',
            nb: 'Befolkningsundersøkelser',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/4.5',
          type: 'HrcsConcept',
          identifier: '4.5',
          label: {
            en: 'Resources and infrastructure (detection) ',
            nb: 'Ressurser og infrastruktur (deteksjon, screening og diagnose)',
          },
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/5',
      type: 'HrcsConcept',
      identifier: '5',
      label: {
        en: 'Development of Treatments and Therapeutic Interventions',
        nb: 'Utvikling av behandlinger og terapeutiske intervensjoner',
      },
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/5.1',
          type: 'HrcsConcept',
          identifier: '5.1',
          label: {
            en: 'Pharmaceuticals',
            nb: 'Legemidler',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/5.2',
          type: 'HrcsConcept',
          identifier: '5.2',
          label: {
            en: 'Cellular and gene therapies',
            nb: 'Celle- og genterapi',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/5.3',
          type: 'HrcsConcept',
          identifier: '5.3',
          label: {
            en: 'Medical devices',
            nb: 'Medisinsk utstyr',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/5.4',
          type: 'HrcsConcept',
          identifier: '5.4',
          label: {
            en: 'Surgery',
            nb: 'Kirurgi',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/5.5',
          type: 'HrcsConcept',
          identifier: '5.5',
          label: {
            en: 'Radiotherapy',
            nb: 'Strålebehandling',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/5.6',
          type: 'HrcsConcept',
          identifier: '5.6',
          label: {
            en: 'Psychological and behavioural',
            nb: 'Psykologiske og atferdsmessige',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/5.7',
          type: 'HrcsConcept',
          identifier: '5.7',
          label: {
            en: 'Physical',
            nb: 'Fysiske',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/5.8',
          type: 'HrcsConcept',
          identifier: '5.8',
          label: {
            en: 'Complementary',
            nb: 'Alternativ behandling',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/5.9',
          type: 'HrcsConcept',
          identifier: '5.9',
          label: {
            en: 'Resources and infrastructure (development of treatments) ',
            nb: 'Ressurser og infrastruktur (utvikling av behandlinger og terapeutiske intervensjoner)',
          },
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/6',
      type: 'HrcsConcept',
      identifier: '6',
      label: {
        en: 'Evaluation of Treatments and Therapeutic Interventions',
        nb: 'Evaluering av behandlinger og terapeutiske intervensjoner',
      },
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/6.1',
          type: 'HrcsConcept',
          identifier: '6.1',
          label: {
            en: 'Pharmaceuticals',
            nb: 'Legemidler',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/6.2',
          type: 'HrcsConcept',
          identifier: '6.2',
          label: {
            en: 'Cellular and gene therapies',
            nb: 'Celle- og genterapi',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/6.3',
          type: 'HrcsConcept',
          identifier: '6.3',
          label: {
            en: 'Medical devices',
            nb: 'Medisinsk utstyr',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/6.4',
          type: 'HrcsConcept',
          identifier: '6.4',
          label: {
            en: 'Surgery',
            nb: 'Kirurgi',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/6.5',
          type: 'HrcsConcept',
          identifier: '6.5',
          label: {
            en: 'Radiotherapy',
            nb: 'Strålebehandling',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/6.6',
          type: 'HrcsConcept',
          identifier: '6.6',
          label: {
            en: 'Psychological and behavioural',
            nb: 'Psykologiske og atferdsmessige',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/6.7',
          type: 'HrcsConcept',
          identifier: '6.7',
          label: {
            en: 'Physical',
            nb: 'Fysiske',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/6.8',
          type: 'HrcsConcept',
          identifier: '6.8',
          label: {
            en: 'Complementary',
            nb: 'Alternativ behandling',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/6.9',
          type: 'HrcsConcept',
          identifier: '6.9',
          label: {
            en: 'Resources and infrastructure (evaluation of treatments) ',
            nb: 'Ressurser og infrastruktur (evaluering av behandlinger og terapeutiske intervensjoner)',
          },
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/7',
      type: 'HrcsConcept',
      identifier: '7',
      label: {
        en: 'Management of Diseases and Conditions',
        nb: 'Håndtering av sykdommer og tilstander',
      },
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/7.1',
          type: 'HrcsConcept',
          identifier: '7.1',
          label: {
            en: 'Individual care needs',
            nb: 'Individuelle omsorgsbehov',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/7.2',
          type: 'HrcsConcept',
          identifier: '7.2',
          label: {
            en: 'End of life care',
            nb: 'Omsorg ved livets slutt',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/7.3',
          type: 'HrcsConcept',
          identifier: '7.3',
          label: {
            en: 'Management and decision making',
            nb: 'Håndtering og beslutningstaking',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/7.4',
          type: 'HrcsConcept',
          identifier: '7.4',
          label: {
            en: 'Resources and infrastructure (disease management) ',
            nb: 'Ressurser og infrastruktur (håndtering av sykdommer og tilstander)',
          },
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/8',
      type: 'HrcsConcept',
      identifier: '8',
      label: {
        en: 'Health and Social Care Services Research',
        nb: 'Helse- og sosialtjenesteforskning',
      },
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/8.1',
          type: 'HrcsConcept',
          identifier: '8.1',
          label: {
            en: 'Organisation and delivery of services',
            nb: 'Organisering og levering av tjenester',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/8.2',
          type: 'HrcsConcept',
          identifier: '8.2',
          label: {
            en: 'Health and welfare economics',
            nb: 'Helse- og velferdsøkonomi',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/8.3',
          type: 'HrcsConcept',
          identifier: '8.3',
          label: {
            en: 'Policy, ethics and research governance',
            nb: 'Politikk, etikk og god vitenskapelig praksis',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/8.4',
          type: 'HrcsConcept',
          identifier: '8.4',
          label: {
            en: 'Research design and methodologies',
            nb: 'Forskningsdesign og metodologi',
          },
        },
        {
          id: 'https://nva.unit.no/hrcs/8.5',
          type: 'HrcsConcept',
          identifier: '8.5',
          label: {
            en: 'Resources and infrastructure (health services)',
            nb: 'Ressurser og infrastruktur (helse-, omsorgs- og sosialtjenesteforskning)',
          },
        },
      ],
    },
  ],
};
