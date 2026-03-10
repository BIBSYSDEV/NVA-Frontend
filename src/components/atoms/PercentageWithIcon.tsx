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
    <CenteredGridBox sx={{ gridTemplateColumns: '1.5rem 1fr', width: '4rem' }}>
      <HorizontalBox sx={{ justifySelf: 'end' }}>
        {!displayEmpty && displayPercentage < warningThresholdMinimum && displayPercentage > 0 ? (
          <WarningIcon fontSize="small" color="warning" />
        ) : !displayEmpty && displayPercentage >= successThresholdMinimum ? (
          <CheckCircleIcon fontSize="small" color="success" />
        ) : null}
      </HorizontalBox>
      <HorizontalBox sx={{ justifySelf: 'start', pl: '0.5rem' }}>
        {displayEmpty ? '-' : displayPercentage > 0 ? `${displayPercentage}%` : alternativeIfZero || '0%'}
      </HorizontalBox>
    </CenteredGridBox>
  );
};
