import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ButtonBaseProps, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { arrowButtonStyle } from '../styled/ButtonStyles';

export const DoubleNextButton = ({ onClick, sx }: ButtonBaseProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('common.go_to_last')}>
      <IconButton onClick={onClick} data-testid={dataTestId.common.doubleNextButton} sx={sx}>
        <KeyboardDoubleArrowRightIcon sx={arrowButtonStyle} />
      </IconButton>
    </Tooltip>
  );
};
