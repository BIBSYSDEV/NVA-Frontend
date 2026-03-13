import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { CenteredGridBox, HorizontalBox } from '../styled/Wrappers';

const DEFAULT_WARNING_THRESHOLD_MINIMUM = 30;
const DEFAULT_SUCCESS_THRESHOLD_MINIMUM = 100;

interface PercentageWithIconProps {
  displayPercentage: number; // Percentage value to display, expected to be between 0 and 100.
  successThresholdMinimum?: number; // Minimum percentage to display success icon, default is 100%
  warningThresholdMinimum?: number; // Minimum percentage to display warning icon, default is 30%
  alternativeIfZero?: string; // For view that wants to display something other than '0%' when percentage is zero, e.g. '-'
  displayEmpty?: boolean; // If true, will display '-' instead of percentage and icons, used when percentage is not applicable
  hideWarningIcon?: boolean;
}

export const PercentageWithIcon = ({
  warningThresholdMinimum = DEFAULT_WARNING_THRESHOLD_MINIMUM,
  successThresholdMinimum = DEFAULT_SUCCESS_THRESHOLD_MINIMUM,
  displayPercentage,
  alternativeIfZero,
  displayEmpty,
  hideWarningIcon = false,
}: PercentageWithIconProps) => {
  return (
    <CenteredGridBox sx={{ gridTemplateColumns: '1rem 1rem', width: '4rem' }}>
      {!displayEmpty && !hideWarningIcon && displayPercentage < warningThresholdMinimum && displayPercentage > 0 ? (
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
