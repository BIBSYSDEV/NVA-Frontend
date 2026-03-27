import { TFunction } from 'i18next';
import {
  getNviApprovedByEverybody,
  getNviApprovedCount,
  getNviCandidatesCount,
  getNviInstitutionName,
  getNviRejectedCount,
  getNviSectorLabel,
  getNviTotalCount,
  getNviValidPoints,
} from '../../../pages/basic_data/app_admin/nviAdmin/nviAdminHelpers';
import { NviAdminSortSelectorType } from '../../../pages/basic_data/app_admin/nviAdmin/nviAdminSortSelector/NviAdminSortSelector';
import { InstitutionReport } from '../../../types/nvi.types';
import { SortSelectorOption } from '../../_molecules/SortSelector';

export enum NviAdminOrderBy {
  Institution = 'institution',
  Sector = 'sector',
  Points = 'points',
  CandidatesApprovedByInstitution = 'candidatesApprovedByInstitution',
  CandidatesApprovedByEverybody = 'candidatesApprovedByEverybody',
  TotalNumber = 'totalNumber',
  NumberOfCandidates = 'numberOfCandidates',
  NumberOfApprovedCandidates = 'numberOfApprovedCandidates',
  NumberOfRejectedCandidates = 'numberOfRejectedCandidates',
}

const commonOptions: SortSelectorOption[] = [
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

const pointsOptions: SortSelectorOption[] = [
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

const statusOptions: SortSelectorOption[] = [
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
      return [...commonOptions, ...statusOptions];
    case NviAdminSortSelectorType.Points:
      return [...commonOptions, ...pointsOptions];
    default:
      return [...commonOptions];
  }
};
export const getNviAdminSortValue = (report: InstitutionReport, orderBy: NviAdminOrderBy, t: TFunction) => {
  switch (orderBy) {
    case NviAdminOrderBy.Institution:
      return getNviInstitutionName(report).toLowerCase();
    case NviAdminOrderBy.Sector:
      return getNviSectorLabel(report, t).toLowerCase();
    case NviAdminOrderBy.Points:
      return getNviValidPoints(report);
    case NviAdminOrderBy.CandidatesApprovedByInstitution:
      return getNviApprovedCount(report);
    case NviAdminOrderBy.CandidatesApprovedByEverybody:
      return getNviApprovedByEverybody(report);
    case NviAdminOrderBy.TotalNumber:
      return getNviTotalCount(report);
    case NviAdminOrderBy.NumberOfCandidates:
      return getNviCandidatesCount(report);
    case NviAdminOrderBy.NumberOfApprovedCandidates:
      return getNviApprovedCount(report);
    case NviAdminOrderBy.NumberOfRejectedCandidates:
      return getNviRejectedCount(report);
    default:
      return getNviInstitutionName(report).toLowerCase();
  }
};
