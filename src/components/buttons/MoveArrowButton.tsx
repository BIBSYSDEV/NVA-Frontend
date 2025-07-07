import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { IconButton, IconButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';

interface MoveArrowButtonProps extends IconButtonProps {
  orientation: 'up' | 'down';
  index: number;
}

export const MoveArrowButton = ({ orientation, index, ...rest }: MoveArrowButtonProps) => {
  const { t } = useTranslation();

  return (
    <IconButton
      title={orientation === 'up' ? t('common.move_up') : t('common.move_down')}
      data-testid={
        orientation === 'up'
          ? dataTestId.registrationWizard.moveUpButton(index)
          : dataTestId.registrationWizard.moveDownButton(index)
      }
      {...rest}>
      <ArrowRightAltIcon sx={{ transform: orientation === 'up' ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
    </IconButton>
  );
};
