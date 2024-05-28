import { useFetchNviCandidates } from '../../api/hooks/useFetchNviCandidates';
import { isValidUrl } from '../../utils/general-helpers';

export const InstititutionNviReports = () => {
  const nviQuery = useFetchNviCandidates({ size: 1, aggregation: 'all' });

  const aggregationKeys = Object.keys(nviQuery.data?.aggregations?.organizationApprovalStatuses ?? {});
  const aggregationKey = aggregationKeys.find((key) => isValidUrl(key));

  const nviAggregations = nviQuery.data?.aggregations?.organizationApprovalStatuses[aggregationKey ?? ''];
  console.log(nviAggregations);

  return <p>TODO</p>;
};
