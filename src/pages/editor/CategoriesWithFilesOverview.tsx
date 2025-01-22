import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CategorySelector } from '../../components/CategorySelector';
import { DocumentHeadTitle } from '../../context/DocumentHeadTitle';
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
      <DocumentHeadTitle>{t('editor.categories_with_files')}</DocumentHeadTitle>
      <Typography variant="h2" gutterBottom>
        {t('editor.categories_with_files')}
      </Typography>
      <CategorySelector selectedCategories={selectedCategories} categoriesWithoutFiles={categoriesWithoutFiles} />
    </>
  );
};
