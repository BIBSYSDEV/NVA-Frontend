import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ListPagination } from '../../components/ListPagination';
import { SortSelector } from '../../components/SortSelector';
import { SearchParam } from '../../utils/searchHelpers';

interface CristinSearchPaginationProps {
  children: ReactNode;
  totalCount: number;
  page: number;
  rowsPerPage: number;
}

export const CristinSearchPagination = ({ children, totalCount, page, rowsPerPage }: CristinSearchPaginationProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const updatePath = (page: string, results: string) => {
    params.set(SearchParam.Page, page);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  const sortingComponent = (
    <SortSelector
      orderKey="orderBy"
      sortKey="sort"
      aria-label={t('search.sort_by')}
      size="small"
      variant="standard"
      options={[
        {
          orderBy: 'name',
          sortOrder: 'asc',
          label: t('search.sort_by_name_asc'),
        },
        {
          orderBy: 'name',
          sortOrder: 'desc',
          label: t('search.sort_by_name_desc'),
        },
      ]}
    />
  );

  return (
    <ListPagination
      count={totalCount}
      page={page}
      onPageChange={(newPage) => updatePath(newPage.toString(), rowsPerPage.toString())}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(newRowsPerPage) => updatePath('1', newRowsPerPage.toString())}
      showPaginationTop
      sortingComponent={sortingComponent}>
      {children}
    </ListPagination>
  );
};
