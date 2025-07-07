import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CategorySelector } from '../../components/CategorySelector';
import { HeadTitle } from '../../components/HeadTitle';
import { RootState } from '../../redux/store';
import { allPublicationInstanceTypes } from '../../types/publicationFieldNames';

export const CategoriesWithFilesOverview = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);
  const selectedCategories = customer?.allowFileUploadForTypes ?? [];

  const categoriesWithoutFiles =
    selectedCategories.length > 0
      ? allPublicationInstanceTypes.filter((type) => !selectedCategories.includes(type))
      : [];

  return (
    <>
      <HeadTitle>{t('editor.categories_with_files')}</HeadTitle>
      <Typography variant="h1" gutterBottom>
        {t('editor.categories_with_files')}
      </Typography>
      <CategorySelector selectedCategories={selectedCategories} categoriesWithoutFiles={categoriesWithoutFiles} />
    </>
  );
};
