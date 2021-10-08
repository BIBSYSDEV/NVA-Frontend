import { ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/actions/notificationActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import {
  CustomerInstitution,
  CustomerVocabulary,
  VocabularyList,
  VocabularyStatus,
} from '../../types/customerInstitution.types';
import { NotificationVariant } from '../../types/notification.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
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

const getTranslatedVocabularyName = (t: TFunction<'editor'>, id: string) =>
  id === defaultHrcsActivity.id
    ? t('registration:description.hrcs_activities')
    : id === defaultHrcsCategory.id
    ? t('registration:description.hrcs_categories')
    : '';

const EditorPage = () => {
  const { t } = useTranslation('editor');
  const user = useSelector((store: RootStore) => store.user);
  const dispatch = useDispatch();

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

      const updatedVocabularyResponse = await authenticatedApiRequest<VocabularyList>({
        url: `${customerInstitution.id}/vocabularies`,
        method: 'PUT',
        data: vocabularyList,
      });

      const vocabularyName = getTranslatedVocabularyName(t, updatedVocabulary.id);

      if (isSuccessStatus(updatedVocabularyResponse.status)) {
        dispatch(setNotification(t('feedback:success.update_vocabulary', { vocabulary: vocabularyName })));
        refetchCustomerInstitution();
      } else if (isErrorStatus(updatedVocabularyResponse.status)) {
        dispatch(
          setNotification(
            t('feedback:error.update_vocabulary', { vocabulary: vocabularyName }),
            NotificationVariant.Error
          )
        );
      }
    }
  };

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('profile:roles.editor')}</PageHeader>
      <Typography variant="h2">{t('select_vocabulary')}</Typography>
      <VocabularyRow
        vocabulary={currentHrcsActivityVocabularies}
        updateVocabulary={updateVocabulary}
        isLoadingCustomer={isLoadingCustomerInstitution}
      />
      <VocabularyRow
        vocabulary={currentHrcsCategoryVocabularies}
        updateVocabulary={updateVocabulary}
        isLoadingCustomer={isLoadingCustomerInstitution}
      />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default EditorPage;

interface VocabularyRowProps {
  vocabulary: CustomerVocabulary;
  updateVocabulary: (updatedVocabulary: CustomerVocabulary) => void;
  isLoadingCustomer: boolean;
}

const VocabularyRow = ({ vocabulary, updateVocabulary, isLoadingCustomer }: VocabularyRowProps) => {
  const { t } = useTranslation('editor');
  const [isLoading, setIsLoading] = useState(isLoadingCustomer);

  useEffect(() => {
    if (!isLoadingCustomer) {
      setIsLoading(false);
    }
  }, [isLoadingCustomer]);

  return (
    <StyledVocabularyRow>
      <ToggleButtonGroup
        color="primary"
        disabled={isLoading}
        value={isLoading ? null : vocabulary.status}
        exclusive
        onChange={(event, value) => {
          if (value) {
            updateVocabulary({ ...vocabulary, status: value });
            setIsLoading(true);
          }
          return null;
        }}>
        <ToggleButton value={VocabularyStatus.Default}>{t('default')}</ToggleButton>
        <ToggleButton value={VocabularyStatus.Allowed}>{t('enabled')}</ToggleButton>
        <ToggleButton value={VocabularyStatus.Disabled}>{t('disabled')}</ToggleButton>
      </ToggleButtonGroup>
      <Typography>{getTranslatedVocabularyName(t, vocabulary.id)}</Typography>
    </StyledVocabularyRow>
  );
};
