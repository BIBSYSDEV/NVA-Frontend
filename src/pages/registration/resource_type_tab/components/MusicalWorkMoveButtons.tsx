import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Box, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../utils/dataTestIds';

interface MusicalWorkMoveButtonsProps {
  index: number;
  listLength: number;
  moveItem: (to: number) => void;
}

export const MusicalWorkMoveButtons = ({ index, listLength, moveItem }: MusicalWorkMoveButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignSelf: 'center' }}>
      <IconButton
        title={t('common.move_up')}
        data-testid={dataTestId.registrationWizard.moveUpButton(index)}
        sx={{ visibility: index === 0 ? 'hidden' : 'visible' }}
        onClick={() => {
          moveItem(index - 1);
        }}>
        <ArrowRightAltIcon sx={{ transform: 'rotate(-90deg)' }} />
      </IconButton>

      <IconButton
        title={t('common.move_down')}
        data-testid={dataTestId.registrationWizard.moveDownButton(index)}
        sx={{ visibility: index === listLength - 1 ? 'hidden' : 'visible' }}
        onClick={() => {
          moveItem(index + 1);
        }}>
        <ArrowRightAltIcon sx={{ transform: 'rotate(90deg)' }} />
      </IconButton>
    </Box>
  );
};
