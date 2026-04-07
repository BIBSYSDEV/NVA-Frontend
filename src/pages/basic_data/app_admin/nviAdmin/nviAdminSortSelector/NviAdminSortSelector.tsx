import { useTranslation } from 'react-i18next';
import { SortSelector } from '../../../../../components/_molecules/SortSelector';
import { NviAdminSortSelectorType } from '../../../../../components/sort-selectors/sort-nvi-table/nvi-admin-sort-types';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { getNviAdminSortOptions } from '../../../../../components/sort-selectors/sort-nvi-table/nvi-admin-sort-helpers';

interface NviAdminSortSelectorProps {
  type: NviAdminSortSelectorType;
}

export const NviAdminSortSelector = ({ type }: NviAdminSortSelectorProps) => {
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
