import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LockClockIcon from '@mui/icons-material/LockClock';
import { BaseStatusChip } from './BaseStatusChip';

export enum StatusValue {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Success = 'SUCCESS',
  Closed = 'CLOSED',
}

interface StatusChipProps {
  status: StatusValue;
  text: string;
}

/* Generic component for showing statuses in NVA for an amount of base statuses even if the text varies. */
export const StatusChip = ({ status, text }: StatusChipProps) => {
  switch (status) {
    case StatusValue.Pending:
      return (
        <BaseStatusChip sx={{ bgcolor: 'neutral87.main' }}>
          <LockClockIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    case StatusValue.InProgress:
      return (
        <BaseStatusChip>
          <HourglassEmptyIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    case StatusValue.Completed:
      return (
        <BaseStatusChip sx={{ bgcolor: 'neutral87.main' }}>
          <CheckIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    case StatusValue.Success:
      return (
        <BaseStatusChip sx={{ bgcolor: 'success.light' }}>
          <CheckIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    case StatusValue.Closed:
      return (
        <BaseStatusChip sx={{ bgcolor: 'warning.light' }}>
          <BlockIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    default:
      return null;
  }
};
