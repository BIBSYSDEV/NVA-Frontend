import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { InstitutionReport } from '../../types/nvi.types';
import { isNviAdminOrderBy } from '../../types/nviAdminSort';
import { getNviAdminSortValue } from '../../utils/nviAdminReportSelectors';

export const useSortInstitutionReports = (reports: InstitutionReport[]) => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const orderBy = searchParams.get('orderBy');
  const sort = searchParams.get('sort');

  return reports
    .map((report, index) => ({ report, index }))
    .sort((a, b) => {
      if (!isNviAdminOrderBy(orderBy)) return 0;
      const direction = sort === 'desc' ? -1 : 1;
      const aValue = getNviAdminSortValue(a.report, orderBy, t);
      const bValue = getNviAdminSortValue(b.report, orderBy, t);

      if (aValue === bValue) return a.index - b.index;
      if (typeof aValue === 'number' && typeof bValue === 'number') return (aValue - bValue) * direction;
      return String(aValue).localeCompare(String(bValue), undefined, { sensitivity: 'base' }) * direction;
    })
    .map(({ report }) => report);
};
