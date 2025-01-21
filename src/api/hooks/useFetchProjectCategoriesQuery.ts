import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchProjectCategrories } from '../cristinApi';

export const useFetchProjectCategoriesQuery = () => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['projectCategories'],
    queryFn: () => fetchProjectCategrories(),
    meta: { errorMessage: t('feedback.error.get_project_categories') },
    gcTime: 1_800_000,
  });
};
