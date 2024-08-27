import { useTranslation } from 'react-i18next';
import { SortSelector } from './SortSelector';

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
      options={[
        {
          orderBy: 'name',
          sortOrder: 'asc',
          label: t('search.sort_alphabetically_asc'),
        },
        {
          orderBy: 'name',
          sortOrder: 'desc',
          label: t('search.sort_alphabetically_desc'),
        },
      ]}
    />
  );
};
