import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LockClockIcon from '@mui/icons-material/LockClock';
import { HorizontalRoundedBox } from './styles';

/* The amount of statuses can be expanded, but should be generic enough to be useful for several components */
export enum StatusValue {
  WaitingToStart = 'WAITING_TO_START',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
  Closed = 'CLOSED',
}

interface BaseStatusChipProps {
  status: StatusValue;
  text: string;
}

/* Generic component for showing statuses in NVA for an amount of base statuses. The goal is that all chips with the same kind of status will use the same icon
and background color even if the text varies. If you need a status that is not in the StatusValue list you can add it, but only if you think it is of general interest */
export const StatusChip = ({ status, text }: BaseStatusChipProps) => {
  switch (status) {
    case StatusValue.WaitingToStart:
      return (
        <HorizontalRoundedBox sx={{ bgcolor: 'neutral87.main' }}>
          <LockClockIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </HorizontalRoundedBox>
      );
    case StatusValue.InProgress:
      return (
        <HorizontalRoundedBox sx={{ bgcolor: 'info.light' }}>
          <HourglassEmptyIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </HorizontalRoundedBox>
      );
    case StatusValue.Closed:
      return (
        <HorizontalRoundedBox sx={{ bgcolor: 'neutral87.main' }}>
          <CheckIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </HorizontalRoundedBox>
      );
    case StatusValue.Success:
      return (
        <HorizontalRoundedBox sx={{ bgcolor: 'success.light' }}>
          <CheckIcon aria-hidden="true" fontSize={'small'} />
          {text}
        </HorizontalRoundedBox>
      );
    default:
      return null;
  }
};
