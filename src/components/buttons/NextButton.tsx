import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ButtonBaseProps, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { arrowButtonStyle } from '../styled/ButtonStyles';

export const NextButton = ({ onClick, sx }: ButtonBaseProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('common.next')}>
      <IconButton onClick={onClick} data-testid={dataTestId.common.nextButton} sx={sx}>
        <KeyboardArrowRightIcon sx={arrowButtonStyle} />
      </IconButton>
    </Tooltip>
  );
};
