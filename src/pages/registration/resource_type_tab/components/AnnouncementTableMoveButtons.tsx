import { Box } from '@mui/material';
import { MoveArrowButton } from '../../../../components/buttons/MoveArrowButton';

interface AnnouncementTableMoveButtonsProps {
  index: number;
  listLength: number;
  moveItem: (to: number) => void;
}

export const AnnouncementTableMoveButtons = ({ index, listLength, moveItem }: AnnouncementTableMoveButtonsProps) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <MoveArrowButton
        orientation="up"
        index={index}
        disabled={index === 0}
        onClick={() => {
          moveItem(index - 1);
        }}
      />

      <MoveArrowButton
        orientation="down"
        index={index}
        disabled={index === listLength - 1}
        onClick={() => {
          moveItem(index + 1);
        }}
      />
    </Box>
  );
};
