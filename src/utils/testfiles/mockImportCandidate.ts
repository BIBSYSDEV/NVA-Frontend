import { ImportCandidate, ImportStatus } from '../../types/importCandidate.types';
import { JournalType } from '../../types/publicationFieldNames';

export const mockImportCandidate: ImportCandidate = {
  type: `ImportCandidate`,
  id: 'https://api.dev.nva.aws.unit.no/registration/12345679',
  additionalIdentifiers: ['12345'],
  importStatus: ImportStatus.NotImported,
  doi: '',
  publicationYear: '2020',
  mainTitle:
    'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting',
  totalContributors: 2,
  totalVerifiedContributors: 1,
  organizations: [
    {
      type: `Organization`,
      id: '12345',
      labels: {
        en: 'My institution',
      },
    },
  ],
  publisher: {
    id: '12345',
    name: 'My Publisher',
  },
  journal: {
    id: '12345',
  },
  publicationInstance: {
    type: JournalType.Corrigendum,
    pages: {
      type: 'Range',
      begin: '',
      end: '',
    },
    articleNumber: '1',
    issue: '2',
    volume: '3',
    corrigendumFor: '',
  },
};
