import { ChatBubble } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam } from '../api/searchApi';
import { TicketStatus } from '../types/publication_types/ticket.types';
import { dataTestId } from '../utils/dataTestIds';

const statusNew: TicketStatus = 'New';

export const DialoguesWithoutCuratorButton = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const dialoguesWithoutCuratorSelected =
    searchParams.get(TicketSearchParam.Status) === statusNew && !searchParams.get(TicketSearchParam.Assignee);

  const toggleDialoguesWithoutCurators = () => {
    if (dialoguesWithoutCuratorSelected) {
      searchParams.delete(TicketSearchParam.Status);
    } else {
      searchParams.set(TicketSearchParam.Status, statusNew);
      searchParams.delete(TicketSearchParam.Assignee);
    }
    history.push({ search: searchParams.toString() });
  };

  return (
    <Button
      fullWidth
      size="medium"
      variant={dialoguesWithoutCuratorSelected ? 'contained' : 'outlined'}
      color="primary"
      sx={{ textTransform: 'none' }}
      startIcon={<ChatBubble />}
      onClick={toggleDialoguesWithoutCurators}
      title={t('tasks.dialogues_without_curator')}
      data-testid={dataTestId.tasksPage.dialoguesWithoutCuratorButton}>
      <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
        {t('tasks.dialogues_without_curator')}
      </Box>
    </Button>
  );
};
