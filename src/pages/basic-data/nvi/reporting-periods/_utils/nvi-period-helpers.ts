import { NviPeriod, NviPeriodStatusEnum } from '../../../../../types/nvi.types';

export const getNviPeriodStatus = (period: NviPeriod): NviPeriodStatusEnum => {
  const now = new Date();
  if (new Date(period.startDate) > now) return NviPeriodStatusEnum.UnopenedPeriod;
  if (new Date(period.reportingDate) > now) return NviPeriodStatusEnum.OpenPeriod;
  return NviPeriodStatusEnum.ClosedPeriod;
};
