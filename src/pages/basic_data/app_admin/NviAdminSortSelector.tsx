import { useTranslation } from 'react-i18next';
import { SortSelector } from '../../../components/SortSelector';
import { HorizontalBox } from '../../../components/styled/Wrappers';
import { NviAdminOrderBy } from '../../../types/nviAdminSort';

export const NviAdminSortSelector = () => {
  const { t } = useTranslation();
  return (
    <HorizontalBox sx={{ mb: '0.25rem', alignSelf: 'flex-end', gap: '1rem' }}>
      {t('sort_by')}
      <SortSelector
        orderKey="orderBy"
        sortKey="sort"
        aria-label={t('search.sort_by')}
        variant="standard"
        options={[
          {
            orderBy: NviAdminOrderBy.Institution,
            sortOrder: 'asc',
            i18nKey: 'sort_by_institution_asc',
          },
          {
            orderBy: NviAdminOrderBy.Institution,
            sortOrder: 'desc',
            i18nKey: 'sort_by_institution_desc',
          },
          {
            orderBy: NviAdminOrderBy.Sector,
            sortOrder: 'asc',
            i18nKey: 'sort_by_sector_asc',
          },
          {
            orderBy: NviAdminOrderBy.Sector,
            sortOrder: 'desc',
            i18nKey: 'sort_by_sector_desc',
          },
          {
            orderBy: NviAdminOrderBy.Points,
            sortOrder: 'asc',
            i18nKey: 'sort_by_points_asc',
          },
          {
            orderBy: NviAdminOrderBy.Points,
            sortOrder: 'desc',
            i18nKey: 'sort_by_points_desc',
          },
          {
            orderBy: NviAdminOrderBy.CandidatesApprovedByInstitution,
            sortOrder: 'asc',
            i18nKey: 'sort_by_candidates_approved_by_institution_asc',
          },
          {
            orderBy: NviAdminOrderBy.CandidatesApprovedByInstitution,
            sortOrder: 'desc',
            i18nKey: 'sort_by_candidates_approved_by_institution_desc',
          },
          {
            orderBy: NviAdminOrderBy.CandidatesApprovedByEverybody,
            sortOrder: 'asc',
            i18nKey: 'sort_by_candidates_approved_by_everybody_asc',
          },
          {
            orderBy: NviAdminOrderBy.CandidatesApprovedByEverybody,
            sortOrder: 'desc',
            i18nKey: 'sort_by_candidates_approved_by_everybody_desc',
          },
        ]}
      />
    </HorizontalBox>
  );
};
