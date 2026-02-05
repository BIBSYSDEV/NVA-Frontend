import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { CenteredGridBox, HorizontalBox } from '../styled/Wrappers';

interface PercentageWithIconProps {
  warningThresholdMinimum: number;
  successThresholdMinimum: number;
  displayPercentage: number;
  alternativeIfZero?: string;
}

export const PercentageWithIcon = ({
  warningThresholdMinimum,
  successThresholdMinimum,
  displayPercentage,
  alternativeIfZero,
}: PercentageWithIconProps) => {
  return (
    <CenteredGridBox sx={{ gridTemplateColumns: '1.5rem auto', width: '100%' }}>
      <HorizontalBox sx={{ justifySelf: 'end' }}>
        {displayPercentage < warningThresholdMinimum && <WarningIcon fontSize="small" color="warning" />}
        {displayPercentage >= successThresholdMinimum && <CheckCircleIcon fontSize="small" color="success" />}
      </HorizontalBox>
      <HorizontalBox sx={{ justifySelf: 'start', pl: '0.5rem' }}>
        {displayPercentage > 0 ? `${displayPercentage}%` : alternativeIfZero}
      </HorizontalBox>
    </CenteredGridBox>
  );
};
