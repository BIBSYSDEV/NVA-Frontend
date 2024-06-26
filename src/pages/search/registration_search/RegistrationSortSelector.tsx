import { useTranslation } from 'react-i18next';
import { ResultParam, ResultSearchOrder, SortOrder } from '../../../api/searchApi';
import { SortSelector } from '../../../components/SortSelector';

interface SortOption {
  orderBy: ResultSearchOrder;
  sortOrder: SortOrder;
  label: string;
}

export const RegistrationSortSelector = () => {
  const { t } = useTranslation();

  const options: SortOption[] = [
    { orderBy: ResultSearchOrder.Relevance, sortOrder: 'desc', label: t('search.sort_by_relevance') },
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
      label: t('search.sort_alphabetically_asc'),
    },
    {
      orderBy: ResultSearchOrder.Title,
      sortOrder: 'desc',
      label: t('search.sort_alphabetically_desc'),
    },
  ];

  return (
    <SortSelector
      sortKey={ResultParam.Sort}
      orderKey={ResultParam.Order}
      paginationKey={ResultParam.From}
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={options}
    />
  );
};
