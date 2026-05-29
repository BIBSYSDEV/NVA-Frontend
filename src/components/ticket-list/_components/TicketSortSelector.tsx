import { useTranslation } from 'react-i18next';
import { SortOrder, TicketOrderBy, TicketSearchParam } from '../../../api/searchApi';
import { SortSelector } from '../../_molecules/SortSelector';

export const TicketSortSelector = () => {
  const { t } = useTranslation();

  return (
    <SortSelector
      orderKey={TicketSearchParam.OrderBy}
      sortKey={TicketSearchParam.SortOrder}
      paginationKey={TicketSearchParam.From}
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={[
        {
          i18nKey: 'search.sort_by_modified_date',
          orderBy: 'modifiedDate' satisfies TicketOrderBy,
          sortOrder: 'desc' satisfies SortOrder,
        },
        {
          i18nKey: 'common.sort_newest_first',
          orderBy: 'createdDate' satisfies TicketOrderBy,
          sortOrder: 'desc' satisfies SortOrder,
        },
        {
          i18nKey: 'common.sort_oldest_first',
          orderBy: 'createdDate' satisfies TicketOrderBy,
          sortOrder: 'asc' satisfies SortOrder,
        },
      ]}
    />
  );
};
