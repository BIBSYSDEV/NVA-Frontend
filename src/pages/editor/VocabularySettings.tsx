import { Box, CircularProgress, Typography } from '@mui/material';
import { TFunction } from 'i18next';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { setPartialCustomer } from '../../redux/customerReducer';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import {
  CustomerVocabulary,
  defaultHrcsActivity,
  defaultHrcsCategory,
  VocabularyList,
} from '../../types/customerInstitution.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { VocabularyRow } from './VocabularyRow';

export const getTranslatedVocabularyName = (t: TFunction, id: string) =>
  id === defaultHrcsActivity.id
    ? t('editor.hrcs_activity')
    : id === defaultHrcsCategory.id
      ? t('editor.hrcs_categories')
      : '';

export const VocabularySettings = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const [vocabularyList, isLoadingVocabularyList, , setVocabularyList] = useFetch<VocabularyList>({
    url: user?.customerId ? `${user.customerId}/vocabularies` : '',
    errorMessage: t('feedback.error.get_vocabularies'),
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
          setNotification({
            message: t('feedback.success.update_vocabulary', {
              vocabulary: vocabularyName,
              status: t(`editor.vocabulary_status.${newVocabulary.status}`).toLowerCase(),
            }),
            variant: 'success',
          })
        );
        setVocabularyList(updatedVocabularyResponse.data);
        dispatch(setPartialCustomer({ vocabularies: updatedVocabularyResponse.data.vocabularies }));
      } else if (isErrorStatus(updatedVocabularyResponse.status)) {
        dispatch(
          setNotification({
            message: t('feedback.error.update_vocabulary', { vocabulary: vocabularyName }),
            variant: 'error',
          })
        );
      }
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title id="vocabulary-label">{t('editor.vocabulary')}</title>
      </Helmet>
      <Typography paragraph color="primary" fontWeight="600">
        {t('editor.select_vocabulary_description')}
      </Typography>

      {isLoadingVocabularyList ? (
        <CircularProgress aria-labelledby="vocabulary-label" />
      ) : (
        vocabularyList && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <VocabularyRow
              vocabulary={currentHrcsActivityVocabularies}
              updateVocabularies={updateVocabularies}
              dataTestId={dataTestId.editor.hrcsActivityButtonGroup}
              disabled={isUpdating}
            />
            <VocabularyRow
              vocabulary={currentHrcsCategoryVocabularies}
              updateVocabularies={updateVocabularies}
              dataTestId={dataTestId.editor.hrcsCategoryButtonGroup}
              disabled={isUpdating}
            />
          </Box>
        )
      )}
      <Typography gutterBottom mt="1rem">
        {t('editor.vocabulary_status.default_description')}
      </Typography>
      <Typography gutterBottom>{t('editor.vocabulary_status.allowed_description')}</Typography>
      <Typography gutterBottom>{t('editor.vocabulary_status.disabled_description')}</Typography>
    </>
  );
};
