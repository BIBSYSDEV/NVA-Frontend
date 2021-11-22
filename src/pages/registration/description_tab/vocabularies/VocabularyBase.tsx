import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import { VocabularyList, VocabularyStatus } from '../../../../types/customerInstitution.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { VocabularyFields } from './VocabularyFields';

export const VocabularyBase = () => {
  const { t } = useTranslation('registration');

  const user = useSelector((store: RootStore) => store.user);

  const [vocabularyList, isLoadingVocabularyList] = useFetch<VocabularyList>({
    url: user?.customerId ? `${user.customerId}/vocabularies` : '',
    errorMessage: t('feedback:error.get_vocabularies'),
    withAuthentication: true,
  });
  const vocabularies = vocabularyList?.vocabularies ?? [];

  const defaultVocabularies = vocabularies
    .filter((vocabulary) => vocabulary.status === VocabularyStatus.Default)
    .map((vocabulary) => vocabulary.id);

  const allowedVocabularies = vocabularies
    .filter((vocabulary) => vocabulary.status === VocabularyStatus.Allowed)
    .map((vocabulary) => vocabulary.id);

  return isLoadingVocabularyList ? (
    <CircularProgress />
  ) : (
    <VocabularyFields defaultVocabularies={defaultVocabularies} allowedVocabularies={allowedVocabularies} />
  );
};
