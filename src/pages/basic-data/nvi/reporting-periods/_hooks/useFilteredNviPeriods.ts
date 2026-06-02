import { useLocation } from 'react-router';
import { PARAM_NAME_PERIOD_STATUSES } from '../../../../../components/filters/nvi/NviStatusMultiSelect';
import { NviPeriodReport, NviPeriodStatusEnum } from '../../../../../types/nvi.types';
import { getNviPeriodStatus } from '../_utils/nvi-period-helpers';

const allowedStatuses = new Set(Object.values(NviPeriodStatusEnum));

export const useFilteredNviPeriods = (periods: NviPeriodReport[]) => {
  const location = useLocation();

  const selectedStatuses = new Set(
    (new URLSearchParams(location.search).get(PARAM_NAME_PERIOD_STATUSES) ?? '')
      .split(',')
      .filter((status): status is NviPeriodStatusEnum => allowedStatuses.has(status as NviPeriodStatusEnum))
  );

  if (selectedStatuses.size === 0) return [];

  return periods.filter((report) => selectedStatuses.has(getNviPeriodStatus(report.period)));
};
