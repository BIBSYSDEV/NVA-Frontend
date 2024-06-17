import { useTranslation } from 'react-i18next';
import { ResultSearchOrder } from '../../../api/searchApi';
import { SortSelector } from '../../../components/SortSelector';

export const RegistrationSortSelector = () => {
  const { t } = useTranslation();

  return (
    <SortSelector
      sortKey="sort"
      orderKey="order"
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={[
        {
          orderBy: ResultSearchOrder.ModifiedDate,
          sortOrder: 'desc',
          label: t('search.sort_by_modified_date'),
        },
        {
          orderBy: ResultSearchOrder.PublicationDate,
          sortOrder: 'desc',
          label: t('search.sort_by_published_date_desc'),
        },
        {
          orderBy: ResultSearchOrder.PublicationDate,
          sortOrder: 'asc',
          label: t('search.sort_by_published_date_asc'),
        },
        {
          orderBy: ResultSearchOrder.Title,
          sortOrder: 'asc',
          label: t('search.sort_alphabetically_desc'),
        },
        {
          orderBy: ResultSearchOrder.Title,
          sortOrder: 'desc',
          label: t('search.sort_alphabetically_asc'),
        },
        { orderBy: ResultSearchOrder.Relevance, sortOrder: 'desc', label: t('search.sort_by_relevance') },
      ]}
    />
  );
};
