import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { IconButton, IconButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface MoveArrowButtonProps extends IconButtonProps {
  orientation: 'up' | 'down';
}

export const MoveArrowButton = ({ orientation, ...rest }: MoveArrowButtonProps) => {
  const { t } = useTranslation();
  const facingUp = orientation === 'up';

  return (
    <IconButton title={facingUp ? t('common.move_up') : t('common.move_down')} {...rest}>
      <ArrowRightAltIcon sx={{ transform: facingUp ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
    </IconButton>
  );
};
