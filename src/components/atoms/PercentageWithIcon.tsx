import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { CenteredGridBox, HorizontalBox } from '../styled/Wrappers';

const DEFAULT_WARNING_THRESHOLD_MINIMUM = 30;
const DEFAULT_SUCCESS_THRESHOLD_MINIMUM = 100;

interface PercentageWithIconProps {
  displayPercentage: number;
  successThresholdMinimum?: number;
  warningThresholdMinimum?: number;
  alternativeIfZero?: string;
  displayEmpty?: boolean;
}

export const PercentageWithIcon = ({
  warningThresholdMinimum = DEFAULT_WARNING_THRESHOLD_MINIMUM,
  successThresholdMinimum = DEFAULT_SUCCESS_THRESHOLD_MINIMUM,
  displayPercentage,
  alternativeIfZero,
  displayEmpty,
}: PercentageWithIconProps) => {
  return (
    <CenteredGridBox sx={{ gridTemplateColumns: '1rem 1rem', width: '4rem' }}>
      {!displayEmpty && displayPercentage < warningThresholdMinimum && displayPercentage > 0 ? (
        <WarningIcon fontSize="small" color="warning" sx={{ gridColumn: '1' }} />
      ) : !displayEmpty && displayPercentage >= successThresholdMinimum ? (
        <CheckCircleIcon fontSize="small" color="success" sx={{ gridColumn: '1' }} />
      ) : null}
      <HorizontalBox sx={{ justifySelf: 'start', pl: '0.5rem', gridColumn: '2' }}>
        {displayEmpty ? '-' : displayPercentage > 0 ? `${displayPercentage}%` : alternativeIfZero || '0%'}
      </HorizontalBox>
    </CenteredGridBox>
  );
};
