import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const CategoriesWithFiles = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('editor.categories_with_files')}</title>
      </Helmet>
      <Typography variant="h2">{t('editor.categories_with_files')}</Typography>
    </>
  );
};
