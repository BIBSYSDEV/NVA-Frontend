import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { VocabularyStatus } from '../../../../types/customerInstitution.types';
import { VocabularyFields } from './VocabularyFields';

export const VocabularyBase = () => {
  const customer = useSelector((store: RootState) => store.customer);
  const vocabularies = customer?.vocabularies ?? [];

  const defaultVocabularies = vocabularies
    .filter((vocabulary) => vocabulary.status === VocabularyStatus.Default)
    .map((vocabulary) => vocabulary.id);

  const allowedVocabularies = vocabularies
    .filter((vocabulary) => vocabulary.status === VocabularyStatus.Allowed)
    .map((vocabulary) => vocabulary.id);

  return <VocabularyFields defaultVocabularies={defaultVocabularies} allowedVocabularies={allowedVocabularies} />;
};
