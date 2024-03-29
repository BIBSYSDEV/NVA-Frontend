import { VocabularyData } from '../../types/vocabulary.types';

// https://github.com/brinxmat/hrcs-skos/blob/main/src/hrcs_activity.json
export const hrcsActivities: VocabularyData = {
  categories: [
    {
      id: 'https://nva.unit.no/hrcs/activity/hrcs_rag_1',
      type: 'HrcsConcept',
      identifier: 'HRCS_RAG_1',
      cristinIdentifier: '1',
      label: {
        en: 'Underpinning Research',
        nb: 'Underbyggende Forskning',
      },
      name: '1 Underpinning research',
      shortName: '1 Underpinning',
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_1_1',
          type: 'HrcsConcept',
          cristinIdentifier: '1.1',
          label: {
            en: 'Normal biological development and functioning',
            nb: 'Normal biologisk utvikling og funksjon',
          },
          identifier: 'HRCS_RA_1_1',
          name: '1.1 Normal biological development and functioning',
          shortName: '1.1 Biological',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_1_2',
          type: 'HrcsConcept',
          cristinIdentifier: '1.2',
          label: {
            en: 'Psychological and socioeconomic processes',
            nb: 'Psykologiske og sosioøkonomiske prosesser',
          },
          identifier: 'HRCS_RA_1_2',
          name: '1.2 Psychological and socioeconomic processes',
          shortName: '1.2 Psychological',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_1_3',
          type: 'HrcsConcept',
          cristinIdentifier: '1.3',
          label: {
            en: 'Chemical and physical sciences',
            nb: 'Kjemiske og fysiske vitenskaper',
          },
          identifier: 'HRCS_RA_1_3',
          name: '1.3 Chemical and physical sciences',
          shortName: '1.3 Physical',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_1_4',
          type: 'HrcsConcept',
          cristinIdentifier: '1.4',
          label: {
            en: 'Methodologies and measurements',
            nb: 'Metodologi og målinger',
          },
          identifier: 'HRCS_RA_1_4',
          name: '1.4 Methodologies and measurements',
          shortName: '1.4 Methods',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_1_5',
          type: 'HrcsConcept',
          cristinIdentifier: '1.5',
          label: {
            en: 'Resources and infrastructure (underpinning) ',
            nb: 'Ressurser og infrastruktur (underbyggende)',
          },
          identifier: 'HRCS_RA_1_5',
          name: '1.5 Resources and infrastructure (underpinning)',
          shortName: '1.5 Resources',
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/activity/hrcs_rag_2',
      type: 'HrcsConcept',
      cristinIdentifier: '2',
      label: {
        en: 'Aetiology',
        nb: 'Årsaksforhold',
      },
      identifier: 'HRCS_RAG_2',
      name: '2 Aetiology',
      shortName: '2 Aetiology',
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_2_1',
          type: 'HrcsConcept',
          cristinIdentifier: '2.1',
          label: {
            en: 'Biological and endogenous factors',
            nb: 'Biologiske og indre faktorer',
          },
          identifier: 'HRCS_RA_2_1',
          name: '2.1 Biological and endogenous factors',
          shortName: '2.1 Endogenous risks',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_2_2',
          type: 'HrcsConcept',
          cristinIdentifier: '2.2',
          label: {
            en: 'Factors relating to physical environment',
            nb: 'Faktorer knyttet til fysisk miljø',
          },
          identifier: 'HRCS_RA_2_2',
          name: '2.2 Factors relating to the physical environment',
          shortName: '2.2 Physical risks',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_2_3',
          type: 'HrcsConcept',
          cristinIdentifier: '2.3',
          label: {
            en: 'Psychological, social and economic factors',
            nb: 'Psykologiske, sosiale og økonomiske faktorer',
          },
          identifier: 'HRCS_RA_2_3',
          name: '2.3 Psychological, social and economic factors',
          shortName: '2.3 Psychological risks',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_2_4',
          type: 'HrcsConcept',
          cristinIdentifier: '2.4',
          label: {
            en: 'Surveillance and distribution',
            nb: 'Overvåking og utbredelse',
          },
          identifier: 'HRCS_RA_2_4',
          name: '2.4 Surveillance and distribution',
          shortName: '2.4 Surveillance',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_2_5',
          type: 'HrcsConcept',
          cristinIdentifier: '2.5',
          label: {
            en: 'Research design and methodologies (aetiology) ',
            nb: 'Forskningsdesign og metodologi (årsaksforhold)',
          },
          identifier: 'HRCS_RA_2_5',
          name: '2.5 Research design and methodologies (aetiology)',
          shortName: '2.5 Design',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_2_6',
          type: 'HrcsConcept',
          cristinIdentifier: '2.6',
          label: {
            en: 'Resources and infrastructure (aetiology) ',
            nb: 'Ressurser og infrastruktur (årsaksforhold)',
          },
          identifier: 'HRCS_RA_2_6',
          name: '2.6 Resources and infrastructure (aetiology)',
          shortName: '2.6 Resources',
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/activity/hrcs_rag_3',
      type: 'HrcsConcept',
      cristinIdentifier: '3',
      label: {
        en: 'Prevention of Disease and Conditions, and Promotion of Well-Being',
        nb: 'Sykdomsforebyggende og helsefremmende tiltak, og fremme av velvære',
      },
      identifier: 'HRCS_RAG_3',
      name: '3 Prevention of disease and conditions, and promotion of well-being',
      shortName: '3 Prevention',
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_3_1',
          type: 'HrcsConcept',
          cristinIdentifier: '3.1',
          label: {
            en: 'Primary prevention interventions to modify behaviours or promote well-being',
            nb: 'Primærforebyggende tiltak for å endre atferd eller fremme helse',
          },
          identifier: 'HRCS_RA_3_1',
          name: '3.1 Primary prevention interventions to modify behaviours or promote wellbeing',
          shortName: '3.1 Primary prevention',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_3_2',
          type: 'HrcsConcept',
          cristinIdentifier: '3.2',
          label: {
            en: 'Interventions to alter physical and biological environmental risks',
            nb: 'Intervensjoner for å endre fysisk og biologisk miljørisiko',
          },
          identifier: 'HRCS_RA_3_2',
          name: '3.2 Interventions to alter physical and biological environmental risks',
          shortName: '3.2 Environmental',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_3_3',
          type: 'HrcsConcept',
          cristinIdentifier: '3.3',
          label: {
            en: 'Nutrition and chemoprevention',
            nb: 'Ernæring og kjemoprevensjon',
          },
          identifier: 'HRCS_RA_3_3',
          name: '3.3 Nutrition and chemoprevention',
          shortName: '3.3 Nutrition',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_3_4',
          type: 'HrcsConcept',
          cristinIdentifier: '3.4',
          label: {
            en: 'Vaccines',
            nb: 'Vaksiner',
          },
          identifier: 'HRCS_RA_3_4',
          name: '3.4 Vaccines',
          shortName: '3.4 Vaccines',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_3_5',
          type: 'HrcsConcept',
          cristinIdentifier: '3.5',
          label: {
            en: 'Resources and infrastructure (prevention) ',
            nb: 'Ressurser og infrastruktur (sykdomsforebyggende og helsefremmende tiltak)',
          },
          identifier: 'HRCS_RA_3_5',
          name: '3.5 Resources and infrastructure (prevention)',
          shortName: '3.5 Resources',
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/activity/hrcs_rag_4',
      type: 'HrcsConcept',
      cristinIdentifier: '4',
      label: {
        en: 'Detection, Screening and Diagnosis',
        nb: 'Påvising, screening og diagnose',
      },
      identifier: 'HRCS_RAG_4',
      name: '4 Detection, screening and diagnosis',
      shortName: '4 Detection',
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_4_1',
          type: 'HrcsConcept',
          cristinIdentifier: '4.1',
          label: {
            en: 'Discovery and preclinical testing of markers and technologies',
            nb: 'Oppdaging og preklinisk testing av markører og teknologier',
          },
          identifier: 'HRCS_RA_4_1',
          name: '4.1 Discovery and preclinical testing of markers and technologies',
          shortName: '4.1 Marker discovery',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_4_2',
          type: 'HrcsConcept',
          cristinIdentifier: '4.2',
          label: {
            en: 'Evaluation of markers and technologies',
            nb: 'Evaluering av markører og teknologier',
          },
          identifier: 'HRCS_RA_4_2',
          name: '4.2 Evaluation of markers and technologies',
          shortName: '4.2 Marker evaluation',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_4_3',
          type: 'HrcsConcept',
          cristinIdentifier: '4.3',
          label: {
            en: 'Influences and impact',
            nb: 'Innflytelse og påvirkningskraft',
          },
          identifier: 'HRCS_RA_4_3',
          name: '4.3 Influences and impact',
          shortName: '4.3 Influences',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_4_4',
          type: 'HrcsConcept',
          cristinIdentifier: '4.4',
          label: {
            en: 'Population screening',
            nb: 'Befolkningsundersøkelser',
          },
          identifier: 'HRCS_RA_4_4',
          name: '4.4 Population screening',
          shortName: '4.4 Screening',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_4_5',
          type: 'HrcsConcept',
          cristinIdentifier: '4.5',
          label: {
            en: 'Resources and infrastructure (detection) ',
            nb: 'Ressurser og infrastruktur (deteksjon, screening og diagnose)',
          },
          identifier: 'HRCS_RA_4_5',
          name: '4.5 Resources and infrastructure (detection)',
          shortName: '4.5 Resources',
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/activity/hrcs_rag_5',
      type: 'HrcsConcept',
      cristinIdentifier: '5',
      label: {
        en: 'Development of Treatments and Therapeutic Interventions',
        nb: 'Utvikling av behandlinger og terapeutiske intervensjoner',
      },
      identifier: 'HRCS_RAG_5',
      name: '5 Development of treatments and therapeutic interventions',
      shortName: '5 Treatment development',
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_1',
          type: 'HrcsConcept',
          cristinIdentifier: '5.1',
          label: {
            en: 'Pharmaceuticals',
            nb: 'Legemidler',
          },
          identifier: 'HRCS_RA_5_1',
          name: '5.1 Pharmaceuticals',
          shortName: '5.1 Pharmaceutical',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_2',
          type: 'HrcsConcept',
          cristinIdentifier: '5.2',
          label: {
            en: 'Cellular and gene therapies',
            nb: 'Celle- og genterapi',
          },
          identifier: 'HRCS_RA_5_2',
          name: '5.2 Cellular and gene therapies',
          shortName: '5.2 Cell and gene therapy',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_3',
          type: 'HrcsConcept',
          cristinIdentifier: '5.3',
          label: {
            en: 'Medical devices',
            nb: 'Medisinsk utstyr',
          },
          identifier: 'HRCS_RA_5_3',
          name: '5.3 Medical devices',
          shortName: '5.3 Devices',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_4',
          type: 'HrcsConcept',
          cristinIdentifier: '5.4',
          label: {
            en: 'Surgery',
            nb: 'Kirurgi',
          },
          identifier: 'HRCS_RA_5_4',
          name: '5.4 Surgery',
          shortName: '5.4 Surgery',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_5',
          type: 'HrcsConcept',
          cristinIdentifier: '5.5',
          label: {
            en: 'Radiotherapy',
            nb: 'Strålebehandling',
          },
          identifier: 'HRCS_RA_5_5',
          name: '5.5 Radiotherapy and other non-invasive therapies',
          shortName: '5.5 Radiotherapy',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_6',
          type: 'HrcsConcept',
          cristinIdentifier: '5.6',
          label: {
            en: 'Psychological and behavioural',
            nb: 'Psykologiske og atferdsmessige',
          },
          identifier: 'HRCS_RA_5_6',
          name: '5.6 Psychological and behavioural',
          shortName: '5.6 Psychological',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_7',
          type: 'HrcsConcept',
          cristinIdentifier: '5.7',
          label: {
            en: 'Physical',
            nb: 'Fysiske',
          },
          identifier: 'HRCS_RA_5_7',
          name: '5.7 Physical',
          shortName: '5.7 Physical',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_8',
          type: 'HrcsConcept',
          cristinIdentifier: '5.8',
          label: {
            en: 'Complementary',
            nb: 'Alternativ behandling',
          },
          identifier: 'HRCS_RA_5_8',
          name: '5.8 Complementary',
          shortName: '5.8 Complementary',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_5_9',
          type: 'HrcsConcept',
          cristinIdentifier: '5.9',
          label: {
            en: 'Resources and infrastructure (development of treatments) ',
            nb: 'Ressurser og infrastruktur (utvikling av behandlinger og terapeutiske intervensjoner)',
          },
          identifier: 'HRCS_RA_5_9',
          name: '5.9 Resources and infrastructure (treatment development)',
          shortName: '5.9 Resources',
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/activity/hrcs_rag_6',
      type: 'HrcsConcept',
      cristinIdentifier: '6',
      label: {
        en: 'Evaluation of Treatments and Therapeutic Interventions',
        nb: 'Evaluering av behandlinger og terapeutiske intervensjoner',
      },
      identifier: 'HRCS_RAG_6',
      name: '6 Evaluation of treatments and therapeutic interventions',
      shortName: '6 Treatment evaluation',
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_1',
          type: 'HrcsConcept',
          cristinIdentifier: '6.1',
          label: {
            en: 'Pharmaceuticals',
            nb: 'Legemidler',
          },
          identifier: 'HRCS_RA_6_1',
          name: '6.1 Pharmaceuticals',
          shortName: '6.1 Pharmaceutical',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_2',
          type: 'HrcsConcept',
          cristinIdentifier: '6.2',
          label: {
            en: 'Cellular and gene therapies',
            nb: 'Celle- og genterapi',
          },
          identifier: 'HRCS_RA_6_2',
          name: '6.2 Cellular and gene therapies',
          shortName: '6.2 Cell and gene therapy',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_3',
          type: 'HrcsConcept',
          cristinIdentifier: '6.3',
          label: {
            en: 'Medical devices',
            nb: 'Medisinsk utstyr',
          },
          identifier: 'HRCS_RA_6_3',
          name: '6.3 Medical devices',
          shortName: '6.3 Devices',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_4',
          type: 'HrcsConcept',
          cristinIdentifier: '6.4',
          label: {
            en: 'Surgery',
            nb: 'Kirurgi',
          },
          identifier: 'HRCS_RA_6_4',
          name: '6.4 Surgery',
          shortName: '6.4 Surgery',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_5',
          type: 'HrcsConcept',
          cristinIdentifier: '6.5',
          label: {
            en: 'Radiotherapy',
            nb: 'Strålebehandling',
          },
          identifier: 'HRCS_RA_6_5',
          name: '6.5 Radiotherapy and other non-invasive therapies',
          shortName: '6.5 Radiotherapy',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_6',
          type: 'HrcsConcept',
          cristinIdentifier: '6.6',
          label: {
            en: 'Psychological and behavioural',
            nb: 'Psykologiske og atferdsmessige',
          },
          identifier: 'HRCS_RA_6_6',
          name: '6.6 Psychological and behavioural',
          shortName: '6.6 Psychological',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_7',
          type: 'HrcsConcept',
          cristinIdentifier: '6.7',
          label: {
            en: 'Physical',
            nb: 'Fysiske',
          },
          identifier: 'HRCS_RA_6_7',
          name: '6.7 Physical',
          shortName: '6.7 Physical',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_8',
          type: 'HrcsConcept',
          cristinIdentifier: '6.8',
          label: {
            en: 'Complementary',
            nb: 'Alternativ behandling',
          },
          identifier: 'HRCS_RA_6_8',
          name: '6.8 Complementary',
          shortName: '6.8 Complementary',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_6_9',
          type: 'HrcsConcept',
          cristinIdentifier: '6.9',
          label: {
            en: 'Resources and infrastructure (evaluation of treatments) ',
            nb: 'Ressurser og infrastruktur (evaluering av behandlinger og terapeutiske intervensjoner)',
          },
          identifier: 'HRCS_RA_6_9',
          name: '6.9 Resources and infrastructure (treatment evaluation)',
          shortName: '6.9 Resources',
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/activity/hrcs_rag_7',
      type: 'HrcsConcept',
      cristinIdentifier: '7',
      label: {
        en: 'Management of Diseases and Conditions',
        nb: 'Håndtering av sykdommer og tilstander',
      },
      identifier: 'HRCS_RAG_7',
      name: '7 Management of diseases and conditions',
      shortName: '7 Disease management',
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_7_1',
          type: 'HrcsConcept',
          cristinIdentifier: '7.1',
          label: {
            en: 'Individual care needs',
            nb: 'Individuelle omsorgsbehov',
          },
          identifier: 'HRCS_RA_7_1',
          name: '7.1 Individual care needs',
          shortName: '7.1 Individual needs',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_7_2',
          type: 'HrcsConcept',
          cristinIdentifier: '7.2',
          label: {
            en: 'End of life care',
            nb: 'Omsorg ved livets slutt',
          },
          identifier: 'HRCS_RA_7_2',
          name: '7.2 End of life care',
          shortName: '7.2 Palliative',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_7_3',
          type: 'HrcsConcept',
          cristinIdentifier: '7.3',
          label: {
            en: 'Management and decision making',
            nb: 'Håndtering og beslutningstaking',
          },
          identifier: 'HRCS_RA_7_3',
          name: '7.3 Management and decision making',
          shortName: '7.3 Management',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_7_4',
          type: 'HrcsConcept',
          cristinIdentifier: '7.4',
          label: {
            en: 'Resources and infrastructure (disease management) ',
            nb: 'Ressurser og infrastruktur (håndtering av sykdommer og tilstander)',
          },
          identifier: 'HRCS_RA_7_4',
          name: '7.4 Resources and infrastructure (disease management)',
          shortName: '7.4 Resources',
        },
      ],
    },
    {
      id: 'https://nva.unit.no/hrcs/activity/hrcs_rag_8',
      type: 'HrcsConcept',
      cristinIdentifier: '8',
      label: {
        en: 'Health and Social Care Services Research',
        nb: 'Helse- og sosialtjenesteforskning',
      },
      identifier: 'HRCS_RAG_8',
      name: '8 Health and social care services research',
      shortName: '8 Health services',
      subcategories: [
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_8_1',
          type: 'HrcsConcept',
          cristinIdentifier: '8.1',
          label: {
            en: 'Organisation and delivery of services',
            nb: 'Organisering og levering av tjenester',
          },
          identifier: 'HRCS_RA_8_1',
          name: '8.1 Organisation and delivery of services',
          shortName: '8.1 Delivery',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_8_2',
          type: 'HrcsConcept',
          cristinIdentifier: '8.2',
          label: {
            en: 'Health and welfare economics',
            nb: 'Helse- og velferdsøkonomi',
          },
          identifier: 'HRCS_RA_8_2',
          name: '8.2 Health and welfare economics',
          shortName: '8.2 Economics',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_8_3',
          type: 'HrcsConcept',
          cristinIdentifier: '8.3',
          label: {
            en: 'Policy, ethics and research governance',
            nb: 'Politikk, etikk og god vitenskapelig praksis',
          },
          identifier: 'HRCS_RA_8_3',
          name: '8.3 Policy, ethics, and research governance',
          shortName: '8.3 Governance',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_8_4',
          type: 'HrcsConcept',
          cristinIdentifier: '8.4',
          label: {
            en: 'Research design and methodologies',
            nb: 'Forskningsdesign og metodologi',
          },
          identifier: 'HRCS_RA_8_4',
          name: '8.4 Research design and methodologies (health services)',
          shortName: '8.4 Design',
        },
        {
          id: 'https://nva.unit.no/hrcs/activity/hrcs_ra_8_5',
          type: 'HrcsConcept',
          cristinIdentifier: '8.5',
          label: {
            en: 'Resources and infrastructure (health services)',
            nb: 'Ressurser og infrastruktur (helse-, omsorgs- og sosialtjenesteforskning)',
          },
          identifier: 'HRCS_RA_8_5',
          name: '8.5 Resources and infrastructure (health services)',
          shortName: '8.5 Resources',
        },
      ],
    },
  ],
};
