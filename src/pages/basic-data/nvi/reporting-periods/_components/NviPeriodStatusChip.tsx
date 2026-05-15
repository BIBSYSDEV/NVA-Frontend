import { useTranslation } from 'react-i18next';
import { StatusChip, StatusValue } from '../../../../../components/_molecules/status-chip/StatusChip';

interface NviPeriodStatusChipProps {
  startDate: string;
  endDate: string;
}

export const NviPeriodStatusChip = ({ startDate, endDate }: NviPeriodStatusChipProps) => {
  const { t } = useTranslation();
  const startDateIsInTheFuture = new Date(startDate) > new Date();
  const startDateIsInThePast = new Date(startDate) <= new Date();
  const endDateIsInTheFuture = new Date(endDate) > new Date();

  const isOngoing = startDateIsInThePast && endDateIsInTheFuture;

  if (startDateIsInTheFuture) {
    return <StatusChip status={StatusValue.Waiting} text={t('nvi_period_status_not_opened')} />;
  }

  if (isOngoing) {
    return <StatusChip status={StatusValue.InProgress} text={t('nvi_period_status_is_going_on')} />;
  }

  return <StatusChip status={StatusValue.Completed} text={t('nvi_period_status_closed')} />;
};
