import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ButtonBaseProps, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { arrowButtonStyle } from '../styled/ButtonStyles';

interface DoubleNextButtonProps extends ButtonBaseProps {
  tooltip?: string;
  testId?: string;
}

export const DoubleNextButton = ({ tooltip, onClick, testId, sx }: DoubleNextButtonProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={tooltip || t('common.last')}>
      <IconButton
        onClick={onClick ? onClick : undefined}
        data-testid={testId || dataTestId.common.doubleNextButton}
        sx={sx}>
        <KeyboardDoubleArrowRightIcon sx={arrowButtonStyle} />
      </IconButton>
    </Tooltip>
  );
};
