import { UseQueryResult } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useFetchNviReportForInstitution } from '../../../../../api/hooks/useFetchNviReportForInstitution';
import { RootState } from '../../../../../redux/store';
import { InstitutionReport } from '../../../../../types/nvi.types';
import { getIdentifierFromId } from '../../../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../../../utils/hooks/useNviCandidatesParams';

export interface NviApprovalStatusCounts {
  new: string | undefined;
  pending: string | undefined;
  approved: string | undefined;
  rejected: string | undefined;
  dispute: string | undefined;
}

export interface NviInstitutionSummary {
  query: UseQueryResult<NoInfer<InstitutionReport>, Error>;
  counts: NviApprovalStatusCounts;
  candidatesTotal: number;
  candidatesCompleted: number;
  completedPercentage: number;
}

interface UseNviInstitutionSummaryOptions {
  enabled?: boolean;
}

export const useNviInstitutionReportSummary = ({
  enabled = true,
}: UseNviInstitutionSummaryOptions = {}): NviInstitutionSummary => {
  const user = useSelector((store: RootState) => store.user);
  const { year } = useNviCandidatesParams();

  const query = useFetchNviReportForInstitution({
    id: getIdentifierFromId(user?.topOrgCristinId ?? ''),
    year: year,
    enabled,
  });

  const byLocalApprovalStatus = query.data?.institutionSummary.byLocalApprovalStatus;
  const totals = query.data?.institutionSummary.totals;

  const counts: NviApprovalStatusCounts = {
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
