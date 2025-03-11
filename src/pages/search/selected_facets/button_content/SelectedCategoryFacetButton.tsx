import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchProjectCategoriesQuery } from '../../../../api/hooks/useFetchProjectCategoriesQuery';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface SelectedProjectCategoryFacetButtonProps {
  value: string;
}

export const SelectedProjectCategoryFacetButton = ({ value }: SelectedProjectCategoryFacetButtonProps) => {
  const { t } = useTranslation();

  const projectCategoriesQuery = useFetchProjectCategoriesQuery();

  const selectedCategoryLabel = projectCategoriesQuery.data?.hits.find((category) => category.type === value)?.label;
  const selecctedCategoryName = getLanguageString(selectedCategoryLabel) || t('common.unknown');

  return projectCategoriesQuery.isPending ? <Skeleton sx={{ width: '7rem', ml: '0.25rem' }} /> : selecctedCategoryName;
};
