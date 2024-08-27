import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { ButtonBaseProps, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { arrowButtonStyle } from '../styled/ButtonStyles';

interface PreviousButtonProps extends ButtonBaseProps {}

export const PreviousButton = ({ onClick, sx }: PreviousButtonProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('common.previous')}>
      <IconButton onClick={onClick} data-testid={dataTestId.common.previousButton} sx={sx}>
        <KeyboardArrowLeftIcon sx={arrowButtonStyle} />
      </IconButton>
    </Tooltip>
  );
};
