import { Card, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchVocabulary } from '../../api/searchApi';
import { RootState } from '../../redux/store';
import {
  defaultHrcsActivity,
  defaultHrcsCategory,
  visibleVocabularyStatuses,
} from '../../types/customerInstitution.types';

export const getTranslatedVocabularyName = (t: TFunction, id: string) =>
  id === defaultHrcsActivity.id
    ? t('editor.hrcs_activity')
    : id === defaultHrcsCategory.id
      ? t('editor.hrcs_categories')
      : '';

export const VocabularyOverview = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const vocabularyQuery = useQuery({
    enabled: !!user?.customerId,
    queryKey: ['vocabulary', user?.customerId],
    queryFn: () => fetchVocabulary(user?.customerId ?? ''),
    meta: { errorMessage: t('feedback.error.get_vocabularies') },
  });

  return (
    <>
      <Helmet>
        <title id="vocabulary-label">{t('editor.vocabulary')}</title>
      </Helmet>

      <Typography gutterBottom fontWeight="600">
        {t('editor.vocabulary_controlled')}
      </Typography>
      <Typography>{t('editor.vocabulary_description')}</Typography>

      {vocabularyQuery.isLoading ? (
        <CircularProgress aria-labelledby="vocabulary-label" />
      ) : (
        vocabularyQuery.data?.vocabularies
          .filter((vocabulary) => visibleVocabularyStatuses.includes(vocabulary.status))
          .map((vocabulary) => {
            return (
              <Card
                sx={{
                  bgcolor: 'white',
                  maxWidth: '450px',
                  mt: '1rem',
                  p: '1.5rem',
                }}>
                <Typography fontWeight="600">{getTranslatedVocabularyName(t, vocabulary.id)}</Typography>
              </Card>
            );
          })
      )}
    </>
  );
};
