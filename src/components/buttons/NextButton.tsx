import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ButtonBaseProps, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { arrowButtonStyle } from '../styled/ButtonStyles';

interface NextButtonProps extends ButtonBaseProps {
  tooltip?: string;
  testId?: string;
}

export const NextButton = ({ tooltip, onClick, testId, sx }: NextButtonProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={tooltip || t('common.next')}>
      <IconButton onClick={onClick ? onClick : undefined} data-testid={testId || dataTestId.common.nextButton} sx={sx}>
        <KeyboardArrowRightIcon sx={arrowButtonStyle} />
      </IconButton>
    </Tooltip>
  );
};
