import { TableRow, TableCell, Typography, Button, Tooltip, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  ArchitectureOutput,
  Award,
  Competition,
  Exhibition,
  MentionInPublication,
  Venue,
} from '../../../../../types/publication_types/artisticRegistration.types';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { CompetitionModal } from './architecture/CompetitionModal';
import { VenueModal } from './design/VenueModal';
import { PublicationMentionModal } from './architecture/PublicationMentionModal';
import { AwardModal } from './architecture/AwardModal';
import { ExhibitionModal } from './architecture/ExhibitionModal';
import { getArtisticOutputName } from '../../../../../utils/registration-helpers';

type ItemType = ArchitectureOutput | Venue;

interface OutputRowProps {
  item: ItemType;
  updateItem: (item: ItemType) => void;
  removeItem: () => void;
  moveItem: (to: number) => void;
  index: number;
  maxIndex: number;
  showTypeColumn?: boolean;
}

export const OutputRow = ({
  updateItem,
  removeItem,
  moveItem,
  item,
  index,
  maxIndex,
  showTypeColumn = false,
}: OutputRowProps) => {
  const { t } = useTranslation('registration');
  const [openEditItem, setOpenEditItem] = useState(false);
  const [openRemoveItem, setOpenRemoveItem] = useState(false);

  const title = getArtisticOutputName(item);
  let removeItemTitle = '';
  let removeItemDescription = '';
  if (
    item.type === 'Competition' ||
    item.type === 'MentionInPublication' ||
    item.type === 'Award' ||
    item.type === 'Exhibition'
  ) {
    removeItemTitle = t('resource_type.artistic.remove_announcement');
    removeItemDescription = t('resource_type.artistic.remove_announcement_description', { name: title });
  } else if (item.type === 'Venue') {
    removeItemTitle = t('resource_type.artistic.remove_venue_title');
    removeItemDescription = t('resource_type.artistic.remove_venue_text', { name: title });
  }

  return (
    <TableRow>
      {showTypeColumn && (
        <TableCell>
          <Typography>{t(`resource_type.artistic.output_type.${item.type}`)}</Typography>
        </TableCell>
      )}
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
      {item.type === 'Competition' && (
        <CompetitionModal
          competition={item as Competition}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      )}
      {item.type === 'Venue' && (
        <VenueModal
          venue={item as Venue}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      )}
      {item.type === 'MentionInPublication' && (
        <PublicationMentionModal
          mentionInPublication={item as MentionInPublication}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      )}
      {item.type === 'Award' && (
        <AwardModal
          award={item as Award}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      )}
      {item.type === 'Exhibition' && (
        <ExhibitionModal
          exhibition={item as Exhibition}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      )}
      <ConfirmDialog
        open={openRemoveItem}
        title={removeItemTitle}
        onCancel={() => setOpenRemoveItem(false)}
        onAccept={() => {
          removeItem();
          setOpenRemoveItem(false);
        }}>
        {removeItemDescription}
      </ConfirmDialog>
    </TableRow>
  );
};
