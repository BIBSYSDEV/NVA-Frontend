import { Typography } from '@mui/material';
import { TFunction, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
import { VocabularyRow } from './VocabularyRow';

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

export const getTranslatedVocabularyName = (t: TFunction<'editor'>, id: string) =>
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
