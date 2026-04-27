import { useSelector } from 'react-redux';
import { useFetchNviReportForInstitution } from '../../../api/hooks/useFetchNviReportForInstitution';
import { RootState } from '../../../redux/store';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

interface UseNviInstitutionSummaryOptions {
  enabled?: boolean;
}

export const useNviInstitutionSummary = ({ enabled = true }: UseNviInstitutionSummaryOptions = {}) => {
  const user = useSelector((store: RootState) => store.user);
  const { year } = useNviCandidatesParams();

  const query = useFetchNviReportForInstitution({
    id: getIdentifierFromId(user?.topOrgCristinId ?? ''),
    year: year,
    enabled,
  });

  const byLocalApprovalStatus = query.data?.institutionSummary.byLocalApprovalStatus;
  const totals = query.data?.institutionSummary.totals;

  const counts = {
    new: byLocalApprovalStatus?.new.toLocaleString(),
    pending: byLocalApprovalStatus?.pending.toLocaleString(),
    approved: byLocalApprovalStatus?.approved.toLocaleString(),
    rejected: byLocalApprovalStatus?.rejected.toLocaleString(),
    dispute: totals?.disputedCount.toLocaleString(),
  };

  const candidatesTotal = totals?.undisputedTotalCount ?? 0;
  const candidatesCompleted = totals?.undisputedProcessedCount ?? 0;
  const completedPercentage = candidatesTotal > 0 ? Math.floor((candidatesCompleted / candidatesTotal) * 100) : 100;

  return { query, counts, candidatesTotal, candidatesCompleted, completedPercentage };
};
