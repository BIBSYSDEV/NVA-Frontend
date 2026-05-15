import { NviPeriod, NviPeriodStatusEnum } from '../../../../../types/nvi.types';

// NOTE: ClosedPeriod and Reported have the same date condition for now, will be differentiated when API supports it
export const getNviPeriodStatus = (period: NviPeriod): NviPeriodStatusEnum => {
  const now = new Date();
  if (new Date(period.startDate) > now) return NviPeriodStatusEnum.UnopenedPeriod;
  if (new Date(period.reportingDate) > now) return NviPeriodStatusEnum.OpenPeriod;
  return NviPeriodStatusEnum.ClosedPeriod;
};
