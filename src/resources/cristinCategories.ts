import { TypedLabel } from '../types/project.types';

// Values from: https://api.cristin.no/v2/projects/categories?lang=nb,nn,en

export const cristinCategories: TypedLabel[] = [
  {
    type: 'BASICRESEARCH',
    label: {
      nb: 'Grunnforskning',
      en: 'Basic Research',
    },
  },
  {
    type: 'APPLIEDRESEARCH',
    label: {
      nb: 'Anvendt forskning',
      en: 'Applied Research',
    },
  },
  {
    type: 'ACADEMICDEV',
    label: {
      nb: 'Faglig utviklingsarbeid',
      en: 'Academic Development',
    },
  },
  {
    type: 'NORARTRES',
    label: {
      nb: 'Program for kunstnerisk utviklingsarbeid',
      en: 'Norwegian Artistic Research ',
    },
  },
  {
    type: 'SHAREDCOST',
    label: {
      nb: 'Bidragsprosjekt',
      en: 'Shared Cost Project',
    },
  },
  {
    type: 'COMISSIONED',
    label: {
      nb: 'Oppdragsprosjekt',
      en: 'Comissioned Research Project',
    },
  },
  {
    type: 'PHD',
    label: {
      nb: 'Doktorgradsprosjekt',
      en: 'Ph.D. Project',
    },
  },
  {
    type: 'INHOUSE',
    label: {
      nb: 'Internt prosjekt',
      en: 'In-house Project',
    },
  },
  {
    type: 'EDUCATIONAL',
    label: {
      nb: 'Pedagogisk utviklingsarbeid',
      en: 'Educational Development',
    },
  },
];
