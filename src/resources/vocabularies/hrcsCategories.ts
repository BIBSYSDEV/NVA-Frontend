import { VocabularyResponse } from '../../types/vocabulary.types';

export const hrcsCategories: VocabularyResponse = {
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
      id: 'https://nva.unit.no/hrcs/health/000',
      type: 'HrcsConcept',
      identifier: '000',
      label: {
        en: 'Blood',
        nb: 'Blod',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/001',
      type: 'HrcsConcept',
      identifier: '001',
      label: {
        en: 'Mental Health',
        nb: 'Mental helse',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/002',
      type: 'HrcsConcept',
      identifier: '002',
      label: {
        en: 'Metabolic and Endocrine',
        nb: 'Stoffskifte og hormoner',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/003',
      type: 'HrcsConcept',
      identifier: '003',
      label: {
        en: 'Musculoskeletal',
        nb: 'Muskulatur og skjelett',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/004',
      type: 'HrcsConcept',
      identifier: '004',
      label: {
        en: 'Neurological',
        nb: 'Nevrologisk',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/005',
      type: 'HrcsConcept',
      identifier: '005',
      label: {
        en: 'Oral and Gastrointestinal',
        nb: 'Munnhule, mage-tarm',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/006',
      type: 'HrcsConcept',
      identifier: '006',
      label: {
        en: 'Renal and Urogenital',
        nb: 'Nyrer, urinveier og kjønnsorgan',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/007',
      type: 'HrcsConcept',
      identifier: '007',
      label: {
        en: 'Reproductive Health and Childbirth',
        nb: 'Forplantning og fødsel',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/008',
      type: 'HrcsConcept',
      identifier: '008',
      label: {
        en: 'Respiratory',
        nb: 'Lunger og luftveier',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/009',
      type: 'HrcsConcept',
      identifier: '009',
      label: {
        en: 'Skin',
        nb: 'Hud',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/010',
      type: 'HrcsConcept',
      identifier: '010',
      label: {
        en: 'Stroke',
        nb: 'Hjerneslag',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/011',
      type: 'HrcsConcept',
      identifier: '011',
      label: {
        en: 'Cancer',
        nb: 'Kreft',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/012',
      type: 'HrcsConcept',
      identifier: '012',
      label: {
        en: 'Generic Health Relevance',
        nb: 'Generell helserelevans',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/013',
      type: 'HrcsConcept',
      identifier: '013',
      label: {
        en: 'Other',
        nb: 'Andre',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/014',
      type: 'HrcsConcept',
      identifier: '014',
      label: {
        en: 'Cardiovascular',
        nb: 'Hjerte og kar',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/015',
      type: 'HrcsConcept',
      identifier: '015',
      label: {
        en: 'Congenital Disorders',
        nb: 'Medfødte lidelser',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/016',
      type: 'HrcsConcept',
      identifier: '016',
      label: {
        en: 'Ear',
        nb: 'Øre',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/017',
      type: 'HrcsConcept',
      identifier: '017',
      label: {
        en: 'Eye',
        nb: 'Øye',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/018',
      type: 'HrcsConcept',
      identifier: '018',
      label: {
        en: 'Infection',
        nb: 'Infeksjon',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/019',
      type: 'HrcsConcept',
      identifier: '019',
      label: {
        en: 'Inflammatory and Immune System',
        nb: 'Betennelse og immunsystem',
      },
    },
    {
      id: 'https://nva.unit.no/hrcs/health/020',
      type: 'HrcsConcept',
      identifier: '020',
      label: {
        en: 'Injuries and Accidents',
        nb: 'Skader og ulykker',
      },
    },
  ],
};
