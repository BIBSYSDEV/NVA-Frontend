import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { CenteredGridBox, HorizontalBox } from '../styled/Wrappers';

interface PercentageWithIconProps {
  warningThresholdMinimum: number;
  successThresholdMinimum: number;
  displayPercentage: number;
  alternativeIfZero?: string;
  displayEmpty?: boolean;
}

export const PercentageWithIcon = ({
  warningThresholdMinimum,
  successThresholdMinimum,
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
