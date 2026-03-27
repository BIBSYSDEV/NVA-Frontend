import { useTranslation } from 'react-i18next';
import { SortSelector } from '../../_molecules/SortSelector';
import { HorizontalBox } from '../../styled/Wrappers';
import { nviAdminSortHelpers } from './nviAdminSortHelpers';

export enum NviAdminSortSelectorType {
  Points = 'points',
  Status = 'status',
}

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
        options={nviAdminSortHelpers(type)}
      />
    </HorizontalBox>
  );
};
