import { Typography, CircularProgress, Box } from '@mui/material';
import { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { setNotification } from '../../redux/actions/notificationActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import { VocabularyList, CustomerVocabulary, VocabularyStatus } from '../../types/customerInstitution.types';
import { NotificationVariant } from '../../types/notification.types';
import { isSuccessStatus, isErrorStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { VocabularyRow } from './VocabularyRow';

const defaultHrcsActivity: CustomerVocabulary = {
  type: 'Vocabulary',
  id: 'https://nva.unit.no/hrcs/activity',
  status: VocabularyStatus.Disabled,
  name: 'HRCS Activity',
};

const defaultHrcsCategory: CustomerVocabulary = {
  type: 'Vocabulary',
  id: 'https://nva.unit.no/hrcs/category',
  status: VocabularyStatus.Disabled,
  name: 'HRCS Category',
};

export const getTranslatedVocabularyName = (t: TFunction<'editor'>, id: string) =>
  id === defaultHrcsActivity.id
    ? t('editor:hrcs_activity')
    : id === defaultHrcsCategory.id
    ? t('editor:hrcs_categories')
    : '';

export const VocabularySettings = () => {
  const { t } = useTranslation('editor');
  const user = useSelector((store: RootStore) => store.user);
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const [vocabularyList, isLoadingVocabularyList, , setVocabularyList] = useFetch<VocabularyList>({
    url: user?.customerId ? `${user.customerId}/vocabularies` : '',
    errorMessage: t('feedback:error.get_vocabularies'),
    withAuthentication: true,
  });

  const vocabularies = vocabularyList?.vocabularies ?? [];
  const currentHrcsActivityVocabularies =
    vocabularies.find((v) => v.id === defaultHrcsActivity.id) ?? defaultHrcsActivity;
  const currentHrcsCategoryVocabularies =
    vocabularies.find((v) => v.id === defaultHrcsCategory.id) ?? defaultHrcsCategory;

  const updateVocabularies = async (newVocabulary: CustomerVocabulary) => {
    if (vocabularyList) {
      setIsUpdating(true);
      const newVocabularyList: VocabularyList = {
        ...vocabularyList,
        vocabularies: [...vocabularies.filter((vocabulary) => vocabulary.id !== newVocabulary.id), newVocabulary],
      };

      const updatedVocabularyResponse = await authenticatedApiRequest<VocabularyList>({
        url: vocabularyList.id,
        method: vocabularies.length === 0 ? 'POST' : 'PUT',
        data: newVocabularyList,
      });

      const vocabularyName = getTranslatedVocabularyName(t, newVocabulary.id);

      if (isSuccessStatus(updatedVocabularyResponse.status)) {
        dispatch(
          setNotification(
            t('feedback:success.update_vocabulary', {
              vocabulary: vocabularyName,
              status: t(newVocabulary.status.toLowerCase()).toLowerCase(),
            })
          )
        );
        setVocabularyList(updatedVocabularyResponse.data);
      } else if (isErrorStatus(updatedVocabularyResponse.status)) {
        dispatch(
          setNotification(
            t('feedback:error.update_vocabulary', { vocabulary: vocabularyName }),
            NotificationVariant.Error
          )
        );
      }
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Typography paragraph color="primary" fontWeight="600">
        {t('select_vocabulary_description')}
      </Typography>

      {isLoadingVocabularyList ? (
        <CircularProgress />
      ) : (
        vocabularyList && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <VocabularyRow
              vocabulary={currentHrcsActivityVocabularies}
              updateVocabularies={updateVocabularies}
              isLoadingCustomer={isLoadingVocabularyList}
              dataTestId={dataTestId.editor.hrcsActivityButtonGroup}
              disabled={isUpdating}
            />
            <VocabularyRow
              vocabulary={currentHrcsCategoryVocabularies}
              updateVocabularies={updateVocabularies}
              isLoadingCustomer={isLoadingVocabularyList}
              dataTestId={dataTestId.editor.hrcsActivityButtonGroup}
              disabled={isUpdating}
            />
          </Box>
        )
      )}
      <Typography gutterBottom mt="1rem">
        {t('default_description')}
      </Typography>
      <Typography gutterBottom>{t('allowed_description')}</Typography>
      <Typography gutterBottom>{t('disabled_description')}</Typography>
    </>
  );
};
