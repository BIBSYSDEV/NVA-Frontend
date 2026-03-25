import { SortSelectorOption } from '../../../../../components/SortSelector';
import { NviAdminOrderBy } from '../nviAdminHelpers';
import { NviAdminSortSelectorType } from './NviAdminSortSelector';

const commonOptions = [
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
];

const pointsOptions = [
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
];

const statusOptions = [
  {
    orderBy: NviAdminOrderBy.TotalNumber,
    sortOrder: 'asc',
    i18nKey: 'sort_by_total_number_asc',
  },
  {
    orderBy: NviAdminOrderBy.TotalNumber,
    sortOrder: 'desc',
    i18nKey: 'sort_by_total_number_desc',
  },
  {
    orderBy: NviAdminOrderBy.NumberOfCandidates,
    sortOrder: 'asc',
    i18nKey: 'sort_by_number_of_candidates_asc',
  },
  {
    orderBy: NviAdminOrderBy.NumberOfCandidates,
    sortOrder: 'desc',
    i18nKey: 'sort_by_number_of_candidates_desc',
  },
  {
    orderBy: NviAdminOrderBy.NumberOfApprovedCandidates,
    sortOrder: 'asc',
    i18nKey: 'sort_by_number_of_approved_candidates_asc',
  },
  {
    orderBy: NviAdminOrderBy.NumberOfApprovedCandidates,
    sortOrder: 'desc',
    i18nKey: 'sort_by_number_of_approved_candidates_desc',
  },
  {
    orderBy: NviAdminOrderBy.NumberOfRejectedCandidates,
    sortOrder: 'asc',
    i18nKey: 'sort_by_number_of_rejected_candidates_asc',
  },
  {
    orderBy: NviAdminOrderBy.NumberOfRejectedCandidates,
    sortOrder: 'desc',
    i18nKey: 'sort_by_number_of_rejected_candidates_desc',
  },
];

export const getNviAdminSortOptions = (type: NviAdminSortSelectorType) => {
  switch (type) {
    case NviAdminSortSelectorType.Status:
      return [...commonOptions, ...statusOptions] as SortSelectorOption[];
    case NviAdminSortSelectorType.Points:
      return [...commonOptions, ...pointsOptions] as SortSelectorOption[];
    default:
      return [...commonOptions] as SortSelectorOption[];
  }
};
