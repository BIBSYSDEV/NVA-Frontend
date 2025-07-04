import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Box, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../utils/dataTestIds';

interface AnnouncementTableMoveButtonsProps {
  index: number;
  listLength: number;
  moveItem: (to: number) => void;
}

export const AnnouncementTableMoveButtons = ({ index, listLength, moveItem }: AnnouncementTableMoveButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignSelf: 'center' }}>
      <IconButton
        title={t('common.move_up')}
        data-testid={dataTestId.registrationWizard.moveUpButton(index)}
        disabled={index === 0}
        onClick={() => {
          moveItem(index - 1);
        }}>
        <ArrowRightAltIcon sx={{ transform: 'rotate(-90deg)' }} />
      </IconButton>

      <IconButton
        title={t('common.move_down')}
        data-testid={dataTestId.registrationWizard.moveDownButton(index)}
        disabled={index === listLength - 1}
        onClick={() => {
          moveItem(index + 1);
        }}>
        <ArrowRightAltIcon sx={{ transform: 'rotate(90deg)' }} />
      </IconButton>
    </Box>
  );
};
