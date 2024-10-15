import { useTranslation } from 'react-i18next';
import { NviCandidateOrderBy, NviCandidatesSearchParam, SortOrder } from '../../../api/searchApi';
import { SortSelector } from '../../../components/SortSelector';

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
          orderBy: 'createdDate' satisfies NviCandidateOrderBy,
          sortOrder: 'desc' satisfies SortOrder,
          i18nKey: 'common.sort_newest_first',
        },
        {
          orderBy: 'createdDate' satisfies NviCandidateOrderBy,
          sortOrder: 'asc' satisfies SortOrder,
          i18nKey: 'common.sort_oldest_first',
        },
      ]}
    />
  );
};
