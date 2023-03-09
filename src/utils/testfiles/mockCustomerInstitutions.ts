import {
  CustomerInstitution,
  CustomerList,
  Sector,
  VocabularyList,
  VocabularyStatus,
} from '../../types/customerInstitution.types';

export const mockCustomerInstitutionVocabularies: VocabularyList = {
  type: 'VocabularyList',
  id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934/vocabularies',
  vocabularies: [
    {
      type: 'Vocabulary',
      name: 'HRCS Category',
      id: 'https://nva.unit.no/hrcs/category',
      status: VocabularyStatus.Allowed,
    },
    {
      type: 'Vocabulary',
      name: 'HRCS Activity',
      id: 'https://nva.unit.no/hrcs/activity',
      status: VocabularyStatus.Default,
    },
  ],
};

export const mockCustomerInstitution: CustomerInstitution = {
  id: 'https://api.dev.nva.aws.unit.no/customer/1',
  name: 'Norwegian University of Science and Technology',
  identifier: '1',
  createdDate: '2020-11-01',
  displayName: 'Norwegian University of Science and Technology',
  shortName: 'NTNU',
  archiveName: 'NTNU Open',
  cristinId: 'https://api.dev.nva.aws.unit.no/cristin/organization/194.0.0.0',
  institutionDns: '1.1.1.1',
  feideOrganizationDomain: 'ntnu.no',
  vocabularies: mockCustomerInstitutionVocabularies.vocabularies,
  publicationWorkflow: 'RegistratorPublishesMetadataAndFiles',
  doiAgent: {
    id: 'https://api.dev.nva.aws.unit.no/customer/1/doiagent',
    prefix: '10.1111',
    username: 'LOFF',
  },
  sector: Sector.Uhi,
  nviInstitution: false,
};

export const mockCustomerInstitutions: CustomerList = {
  customers: [
    {
      id: mockCustomerInstitution.id,
      createdDate: mockCustomerInstitution.createdDate,
      displayName: mockCustomerInstitution.displayName,
    },
    {
      id: 'https://api.dev.nva.aws.unit.no/customer/2',
      createdDate: '2020-11-01',
      displayName: 'Name 1',
    },
    {
      id: 'https://api.dev.nva.aws.unit.no/customer/3',
      createdDate: '2020-11-01',
      displayName: 'Name 2',
    },
    {
      id: 'https://api.dev.nva.aws.unit.no/customer/4',
      createdDate: '2020-01-27',
      displayName: 'Name 3',
    },
    {
      id: 'https://api.dev.nva.aws.unit.no/customer/5',
      createdDate: '2012-11-11',
      displayName: 'Name 4',
    },
  ],
};
