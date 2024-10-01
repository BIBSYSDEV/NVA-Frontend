import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ProjectSearchOrder } from '../api/cristinApi';
import { SortOrder } from '../api/searchApi';
import { SortSelector } from './SortSelector';

interface ProjectSortOption {
  orderBy: ProjectSearchOrder;
  sortOrder: SortOrder;
  label: string;
}

export const projectSortOptions: ProjectSortOption[] = [
  {
    orderBy: ProjectSearchOrder.Name,
    sortOrder: 'asc',
    label: t('search.sort_alphabetically_asc'),
  },
  {
    orderBy: ProjectSearchOrder.Name,
    sortOrder: 'desc',
    label: t('search.sort_alphabetically_desc'),
  },
];

export const ProjectSortSelector = () => {
  const { t } = useTranslation();

  return (
    <SortSelector
      orderKey="orderBy"
      sortKey="sort"
      paginationKey="page"
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={projectSortOptions}
    />
  );
};
