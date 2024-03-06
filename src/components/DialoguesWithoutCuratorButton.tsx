import { ChatBubble } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TicketSearchParam } from '../api/searchApi';
import { TicketStatus } from '../types/publication_types/ticket.types';
import { dataTestId } from '../utils/dataTestIds';

export const DialoguesWithoutCuratorButton = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const onClick = () => {
    const statusNew: TicketStatus = 'New';
    searchParams.set(TicketSearchParam.Status, statusNew);
    searchParams.delete(TicketSearchParam.Assignee);
    history.push({ search: searchParams.toString() });
  };

  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      color="primary"
      sx={{ textTransform: 'none' }}
      startIcon={<ChatBubble />}
      onClick={() => onClick()}
      title={t('tasks.dialogues_without_curator')}
      data-testid={dataTestId.tasksPage.dialoguesWithoutCuratorButton}>
      <Typography noWrap>{t('tasks.dialogues_without_curator')}</Typography>
    </Button>
  );
};
