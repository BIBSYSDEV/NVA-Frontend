import { useTranslation } from 'react-i18next';
import { StatusChip, StatusValue } from '../../../../../components/_molecules/status-chip/StatusChip';
import { NviPeriod, NviPeriodStatusEnum } from '../../../../../types/nvi.types';
import { getNviPeriodStatus } from '../_utils/nvi-period-helpers';

interface NviPeriodStatusChipProps {
  period: NviPeriod;
}

export const NviPeriodStatusChip = ({ period }: NviPeriodStatusChipProps) => {
  const { t } = useTranslation();
  const status = getNviPeriodStatus(period);

  switch (status) {
    case NviPeriodStatusEnum.UnopenedPeriod:
      return <StatusChip status={StatusValue.Pending} text={t('nvi_period_status_not_opened')} />;
    case NviPeriodStatusEnum.OpenPeriod:
      return <StatusChip status={StatusValue.InProgress} text={t('nvi_period_status_is_going_on')} />;
    case NviPeriodStatusEnum.ClosedPeriod:
      return <StatusChip status={StatusValue.Completed} text={t('nvi_period_status_closed')} />;
    default:
      return null;
  }
};
