import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LockClockIcon from '@mui/icons-material/LockClock';
import { BaseStatusChip } from './BaseStatusChip';

export enum StatusValue {
  Waiting = 'WAITING',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Success = 'SUCCESS',
  Closed = 'CLOSED',
}

interface BaseStatusChipProps {
  status: StatusValue;
  text: string;
}

/* Generic component for showing statuses in NVA for an amount of base statuses. Enabling all chips with the same kind of status to use the same icon
and background color even if the text varies. */
export const StatusChip = ({ status, text }: BaseStatusChipProps) => {
  switch (status) {
    case StatusValue.Waiting:
      return (
        <BaseStatusChip bgcolor={'neutral87.main'}>
          <LockClockIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    case StatusValue.InProgress:
      return (
        <BaseStatusChip bgcolor={'info.light'}>
          <HourglassEmptyIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    case StatusValue.Completed:
      return (
        <BaseStatusChip bgcolor={'neutral87.main'}>
          <CheckIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    case StatusValue.Success:
      return (
        <BaseStatusChip bgcolor={'success.light'}>
          <CheckIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    case StatusValue.Closed:
      return (
        <BaseStatusChip bgcolor={'warning.light'}>
          <BlockIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </BaseStatusChip>
      );
    default:
      return null;
  }
};
