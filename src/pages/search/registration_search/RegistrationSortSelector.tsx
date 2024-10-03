import { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ResultParam, ResultSearchOrder, SortOrder } from '../../../api/searchApi';
import { SortSelector } from '../../../components/SortSelector';

interface RegistrationSortOption {
  orderBy: ResultSearchOrder;
  sortOrder: SortOrder;
  i18nKey: ParseKeys;
}

export const registrationSortOptions: RegistrationSortOption[] = [
  { orderBy: ResultSearchOrder.Relevance, sortOrder: 'desc', i18nKey: 'search.sort_by_relevance' },
  {
    orderBy: ResultSearchOrder.ModifiedDate,
    sortOrder: 'desc',
    i18nKey: 'search.sort_by_modified_date',
  },
  {
    orderBy: ResultSearchOrder.PublicationDate,
    sortOrder: 'desc',
    i18nKey: 'search.sort_by_published_date_desc',
  },
  {
    orderBy: ResultSearchOrder.PublicationDate,
    sortOrder: 'asc',
    i18nKey: 'search.sort_by_published_date_asc',
  },
  {
    orderBy: ResultSearchOrder.Title,
    sortOrder: 'asc',
    i18nKey: 'search.sort_alphabetically_asc',
  },
  {
    orderBy: ResultSearchOrder.Title,
    sortOrder: 'desc',
    i18nKey: 'search.sort_alphabetically_desc',
  },
];

export const RegistrationSortSelector = () => {
  const { t } = useTranslation();

  return (
    <SortSelector
      sortKey={ResultParam.Sort}
      orderKey={ResultParam.Order}
      paginationKey={ResultParam.From}
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={registrationSortOptions}
    />
  );
};
