import { ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import {
  CustomerInstitution,
  CustomerVocabulary,
  VocabularyList,
  VocabularyStatus,
} from '../../types/customerInstitution.types';
import { useFetch } from '../../utils/hooks/useFetch';

const StyledVocabularyRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  div:first-child {
    margin-right: 1rem;
  }
`;

const defaultHrcsActivity: CustomerVocabulary = {
  type: 'Vocabulary',
  id: 'https://nva.unit.no/hrcs/activity',
  status: VocabularyStatus.Allowed,
  name: 'HRCS Activity',
};

const defaultHrcsCategory: CustomerVocabulary = {
  type: 'Vocabulary',
  id: 'https://nva.unit.no/hrcs/category',
  status: VocabularyStatus.Allowed,
  name: 'HRCS Category',
};

const EditorPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootStore) => store.user);

  const [customerInstitution, isLoadingCustomerInstitution, refetchCustomerInstitution] = useFetch<CustomerInstitution>(
    {
      url: user?.customerId ?? '',
      errorMessage: t('feedback:error.get_customer'),
      withAuthentication: true,
    }
  );

  const vocabularies = customerInstitution?.vocabularies ?? [];
  const currentHrcsActivityVocabularies =
    vocabularies.find((v) => v.id === defaultHrcsActivity.id) ?? defaultHrcsActivity;
  const currentHrcsCategoryVocabularies =
    vocabularies.find((v) => v.id === defaultHrcsCategory.id) ?? defaultHrcsCategory;

  const updateVocabulary = async (updatedVocabulary: CustomerVocabulary) => {
    if (customerInstitution) {
      const vocabularyList: VocabularyList = {
        type: 'VocabularyList',
        id: customerInstitution.id,
        vocabularies: [
          ...vocabularies.filter((vocabulary) => vocabulary.id !== updatedVocabulary.id),
          updatedVocabulary,
        ],
      };

      const updatedCustomerInstitution = await authenticatedApiRequest({
        url: `${customerInstitution.id}/vocabularies`,
        method: 'PUT',
        data: vocabularyList,
      });
      refetchCustomerInstitution();
    }
  };

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>Redaktør</PageHeader>
      <Typography variant="h2">Velg vokabular</Typography>
      <VocabularyRow vocabulary={currentHrcsActivityVocabularies} updateVocabulary={updateVocabulary} />
      <VocabularyRow vocabulary={currentHrcsCategoryVocabularies} updateVocabulary={updateVocabulary} />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default EditorPage;

interface VocabularyRowProps {
  vocabulary: CustomerVocabulary;
  updateVocabulary: (updatedVocabulary: CustomerVocabulary) => void;
}

const VocabularyRow = ({ vocabulary, updateVocabulary }: VocabularyRowProps) => {
  return (
    <StyledVocabularyRow>
      <ToggleButtonGroup
        color="primary"
        value={vocabulary.status}
        exclusive
        onChange={(event, value) => (value ? updateVocabulary({ ...vocabulary, status: value }) : null)}>
        <ToggleButton value={VocabularyStatus.Default}>Default</ToggleButton>
        <ToggleButton value={VocabularyStatus.Allowed}>Enabled</ToggleButton>
        <ToggleButton value={VocabularyStatus.Disabled}>Disabled</ToggleButton>
      </ToggleButtonGroup>
      <Typography>{vocabulary.name}</Typography>
    </StyledVocabularyRow>
  );
};
