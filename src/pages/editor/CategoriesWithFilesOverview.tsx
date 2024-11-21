import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CategorySelector } from '../../components/CategorySelector';
import { RootState } from '../../redux/store';

export const CategoriesWithFilesOverview = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);
  const selectedCategories = customer?.allowFileUploadForTypes ?? [];

  return (
    <>
      <Helmet>
        <title>{t('editor.categories_with_files')}</title>
      </Helmet>
      <Typography variant="h2" gutterBottom>
        {t('editor.categories_with_files')}
      </Typography>
      <CategorySelector selectedCategories={selectedCategories} showNoFilesIcon />
    </>
  );
};
