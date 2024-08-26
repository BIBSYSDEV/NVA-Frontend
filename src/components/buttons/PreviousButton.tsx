import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { ButtonBaseProps, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { arrowButtonStyle } from '../styled/ButtonStyles';

interface PreviousButtonProps extends ButtonBaseProps {
  tooltip?: string;
  testId?: string;
}

export const PreviousButton = ({ tooltip, onClick, testId, sx }: PreviousButtonProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={tooltip || t('common.previous')}>
      <IconButton
        onClick={onClick ? onClick : undefined}
        data-testid={testId || dataTestId.common.previousButton}
        sx={sx}>
        <KeyboardArrowLeftIcon sx={arrowButtonStyle} />
      </IconButton>
    </Tooltip>
  );
};
