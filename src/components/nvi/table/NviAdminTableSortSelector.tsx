import { useTranslation } from 'react-i18next';
import { SortSelector } from '../../_molecules/SortSelector';
import { getNviAdminSortOptions } from '../../sort-selectors/sort-nvi-table/nvi-admin-sort-helpers';
import { NviAdminSortSelectorType } from '../../sort-selectors/sort-nvi-table/nvi-admin-sort-types';
import { HorizontalBox } from '../../styled/Wrappers';

interface NviAdminTableSortSelectorProps {
  type: NviAdminSortSelectorType;
}

export const NviAdminTableSortSelector = ({ type }: NviAdminTableSortSelectorProps) => {
  const { t } = useTranslation();
  return (
    <HorizontalBox sx={{ mb: '0.25rem', alignSelf: 'flex-end', gap: '1rem' }}>
      {t('sort_by')}
      <SortSelector
        orderKey="orderBy"
        sortKey="sort"
        aria-label={t('search.sort_by')}
        variant="standard"
        options={getNviAdminSortOptions(type)}
      />
    </HorizontalBox>
  );
};
