import { useTranslation } from 'react-i18next';
import { NviCandidateOrderBy, NviCandidatesSearchParam, SortOrder } from '../../../api/searchApi';
import { SortSelector } from '../../../components/_molecules/SortSelector';

export const NviSortSelector = () => {
  const { t } = useTranslation();

  return (
    <SortSelector
      sortKey={NviCandidatesSearchParam.SortOrder}
      orderKey={NviCandidatesSearchParam.OrderBy}
      paginationKey={NviCandidatesSearchParam.Offset}
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={[
        {
          orderBy: 'publicationDate' satisfies NviCandidateOrderBy,
          sortOrder: 'desc' satisfies SortOrder,
          i18nKey: 'search.sort_by_published_date_desc',
        },
        {
          orderBy: 'publicationDate' satisfies NviCandidateOrderBy,
          sortOrder: 'asc' satisfies SortOrder,
          i18nKey: 'search.sort_by_published_date_asc',
        },
        {
          orderBy: 'title' satisfies NviCandidateOrderBy,
          sortOrder: 'asc' satisfies SortOrder,
          i18nKey: 'search.sort_alphabetically_asc',
        },
        {
          orderBy: 'title' satisfies NviCandidateOrderBy,
          sortOrder: 'desc' satisfies SortOrder,
          i18nKey: 'search.sort_alphabetically_desc',
        },
        {
          orderBy: 'modifiedDate' satisfies NviCandidateOrderBy,
          sortOrder: 'desc' satisfies SortOrder,
          i18nKey: 'search.sort_by_modified_date',
        },
      ]}
    />
  );
};
