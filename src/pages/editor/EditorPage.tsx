import { ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { CustomerInstitution, CustomerVocabulary, VocabularyState } from '../../types/customerInstitution.types';
import { useFetch } from '../../utils/hooks/useFetch';

const StyledVocabularyRow = styled.div`
  display: flex;
  align-items: center;
`;

const defaultHrcsActivity: CustomerVocabulary = {
  type: 'Vocabulary',
  id: 'https://nva.unit.no/hrcs/activity',
  active: VocabularyState.Enabled,
  name: 'HRCS Activity',
};

const defaultHrcsCategory: CustomerVocabulary = {
  type: 'Vocabulary',
  id: 'https://nva.unit.no/hrcs/category',
  active: VocabularyState.Enabled,
  name: 'HRCS Category',
};

const EditorPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootStore) => store.user);

  const [customerInstitution, isLoadingCustomerInstitution] = useFetch<CustomerInstitution>({
    url: user?.customerId ?? '',
    errorMessage: t('feedback:error.get_customer'),
    withAuthentication: true,
  });

  const vocabularies = customerInstitution?.vocabularies ?? [];
  const currentHrcsActivityVocabularies =
    vocabularies.find((v) => v.id === defaultHrcsActivity.id) ?? defaultHrcsActivity;
  const currentHrcsCategoryVocabularies =
    vocabularies.find((v) => v.id === defaultHrcsCategory.id) ?? defaultHrcsCategory;

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>Redaktør</PageHeader>
      <Typography variant="h2">Velg vokabular</Typography>
      <VocabularyRow
        vocabulary={currentHrcsActivityVocabularies}
        name={'HRCS Activity - Health Research Classification System - Activity'}
      />
      <VocabularyRow
        vocabulary={currentHrcsCategoryVocabularies}
        name={'HRCS Categories - Health Research CLassification System - Categories'}
      />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default EditorPage;

interface VocabularyRowProps {
  vocabulary: CustomerVocabulary;
  name: string;
}

const VocabularyRow = ({ vocabulary, name }: VocabularyRowProps) => {
  const [selectedValue, setSelectedValue] = useState(vocabulary.active);

  return (
    <StyledVocabularyRow>
      <ToggleButtonGroup
        color="primary"
        value={selectedValue}
        exclusive
        onChange={(event, value) => (value ? setSelectedValue(value) : null)}>
        <ToggleButton value={VocabularyState.Default}>Default</ToggleButton>
        <ToggleButton value={VocabularyState.Enabled}>Enabled</ToggleButton>
        <ToggleButton value={VocabularyState.Disabled}>Disabled</ToggleButton>
      </ToggleButtonGroup>
      <Typography>{name}</Typography>
    </StyledVocabularyRow>
  );
};
