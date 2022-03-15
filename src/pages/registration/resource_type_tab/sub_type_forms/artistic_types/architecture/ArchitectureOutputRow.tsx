import { TableRow, TableCell, Typography, Button, Tooltip, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { ArchitectureOutput, Competition } from '../../../../../../types/publication_types/artisticRegistration.types';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import { CompetitionModal } from './CompetitionModal';

interface ArchitectureOutputRowProps {
  item: ArchitectureOutput;
  updateItem: (item: ArchitectureOutput) => void;
  removeItem: () => void;
  moveItem: (to: number) => void;
  index: number;
  maxIndex: number;
}

export const ArchitectureOutputRow = ({
  updateItem,
  removeItem,
  moveItem,
  item,
  index,
  maxIndex,
}: ArchitectureOutputRowProps) => {
  const { t } = useTranslation('registration');
  const [openEditItem, setOpenEditItem] = useState(false);
  const [openRemoveItem, setOpenRemoveItem] = useState(false);

  const object = item.type === 'Competition' ? (item as Competition) : null;
  const title = object?.name ?? '';

  return (
    <TableRow>
      <TableCell>
        <Typography>{t(`resource_type.artistic.architecture_output_type.${item.type}`)}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{title}</Typography>
      </TableCell>
      <TableCell>
        {maxIndex !== 0 && (
          <Box
            sx={{ display: 'grid', gridTemplateAreas: '"down up"', gridTemplateColumns: '1fr 1fr', maxWidth: '8rem' }}>
            {index !== maxIndex && (
              <Tooltip title={t<string>('common:move_down')} sx={{ gridArea: 'down' }}>
                <Button onClick={() => moveItem(index + 1)}>
                  <ArrowDownwardIcon />
                </Button>
              </Tooltip>
            )}
            {index !== 0 && (
              <Tooltip title={t<string>('common:move_up')} sx={{ gridArea: 'up' }}>
                <Button onClick={() => moveItem(index - 1)}>
                  <ArrowUpwardIcon />
                </Button>
              </Tooltip>
            )}
          </Box>
        )}
      </TableCell>
      <TableCell>
        <Button onClick={() => setOpenEditItem(true)} variant="outlined" sx={{ mr: '1rem' }} startIcon={<EditIcon />}>
          {t('common:show')}/{t('common:edit')}
        </Button>
        <Button onClick={() => setOpenRemoveItem(true)} variant="outlined" color="error" startIcon={<DeleteIcon />}>
          {t('common:remove')}
        </Button>
      </TableCell>
      <CompetitionModal
        competition={object}
        onSubmit={updateItem}
        open={openEditItem}
        closeModal={() => setOpenEditItem(false)}
      />
      <ConfirmDialog
        open={openRemoveItem}
        title={t('resource_type.artistic.remove_announcement')}
        onCancel={() => setOpenRemoveItem(false)}
        onAccept={() => {
          removeItem();
          setOpenRemoveItem(false);
        }}>
        {t('resource_type.artistic.remove_announcement_description', { name: title })}
      </ConfirmDialog>
    </TableRow>
  );
};
