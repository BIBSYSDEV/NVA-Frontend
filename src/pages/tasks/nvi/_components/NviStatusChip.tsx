import { useTranslation } from 'react-i18next';
import { StatusChip, StatusValue } from '../../../../components/_molecules/status-chip/StatusChip';
import { NviCandidateApprovalStatus } from '../../../../types/nvi.types';

interface NviStatusChip {
  status: NviCandidateApprovalStatus;
}

export const NviStatusChip = ({ status }: NviStatusChip) => {
  const { t } = useTranslation();

  const text = t(`tasks.nvi.status.${status}`);

  if (status === 'Approved') {
    return <StatusChip text={text} status={StatusValue.Success} />;
  }

  if (status === 'Rejected') {
    return <StatusChip text={text} status={StatusValue.Closed} />;
  }

  return <StatusChip text={text} status={StatusValue.InProgress} />;
};
