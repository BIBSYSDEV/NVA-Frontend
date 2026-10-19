import { useTranslation } from 'react-i18next';
import { StatusChip, StatusValue } from '../../../components/_molecules/status-chip/StatusChip';
import { KbsStatus } from '../kbs.types';

interface KbsStatusChipProps {
  status: KbsStatus;
}

export const KbsStatusChip = ({ status }: KbsStatusChipProps) => {
  const { t } = useTranslation();

  switch (status) {
    case KbsStatus.NotAssessed:
      return <StatusChip status={StatusValue.InProgress} text={t('not_assessed')} />;
    case KbsStatus.Candidate:
      return <StatusChip status={StatusValue.InProgress} text={t('candidate')} />;
    case KbsStatus.Delivered:
      return <StatusChip status={StatusValue.Completed} text={t('delivered')} />;
    case KbsStatus.Reported:
      return <StatusChip status={StatusValue.Success} text={t('reported')} />;
  }
};
