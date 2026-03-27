import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { NviAdminOrderBy } from '../../components/src/components/sortSelectors/sortNviTable/nviAdminSortHelpers';
import { getNviAdminSortValue } from '../../pages/basic_data/app_admin/nviAdmin/nviAdminHelpers';
import { InstitutionReport } from '../../types/nvi.types';

export const useInstitutionReportsSortedByUrl = (reports: InstitutionReport[]) => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const orderBy = (searchParams.get('orderBy') as NviAdminOrderBy) || NviAdminOrderBy.Institution;
  const sort = searchParams.get('sort') || 'asc';

  return reports
    .map((report, index) => ({ report, index }))
    .sort((a, b) => {
      const direction = sort === 'desc' ? -1 : 1;
      const aValue = getNviAdminSortValue(a.report, orderBy, t);
      const bValue = getNviAdminSortValue(b.report, orderBy, t);

      if (aValue === bValue) return a.index - b.index;
      if (typeof aValue === 'number' && typeof bValue === 'number') return (aValue - bValue) * direction;
      return String(aValue).localeCompare(String(bValue), undefined, { sensitivity: 'base' }) * direction;
    })
    .map(({ report }) => report);
};
