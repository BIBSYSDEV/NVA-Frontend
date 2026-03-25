import { useTranslation } from 'react-i18next';
import { SortSelector } from '../../../../../components/SortSelector';
import { HorizontalBox } from '../../../../../components/styled/Wrappers';
import { NviAdminSortSelectorType } from '../nviAdminHelpers';
import { getNviAdminSortOptions } from './getNviAdminSortOptions';

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
