import { useTranslation } from 'react-i18next';
import { NviCandidateApprovalStatus } from '../../../types/nvi.types';
import { StatusChip, StatusValue } from './StatusChip';

interface NviStatusChip {
  status: NviCandidateApprovalStatus;
}

export const NviStatusChip = ({ status }: NviStatusChip) => {
  const { t } = useTranslation();

  const text = t(`tasks.nvi.status.${status}`);

  if (status === 'Approved') {
    return <StatusChip status={StatusValue.Success} text={text} />;
  }

  if (status === 'Rejected') {
    return <StatusChip status={StatusValue.Closed} text={text} />;
  }

  return <StatusChip status={StatusValue.InProgress} text={text} />;
};
