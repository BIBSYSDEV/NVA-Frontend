import { TableRow, TableCell, Typography, Button, Tooltip, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  Award,
  Broadcast,
  Competition,
  Exhibition,
  MentionInPublication,
  ArtisticOutputItem,
  Venue,
  CinematicRelease,
  OtherRelease,
  MusicScore,
  AudioVisualPublication,
  Concert,
  OtherMusicPerformance,
} from '../../../../../types/publication_types/artisticRegistration.types';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { CompetitionModal } from './architecture/CompetitionModal';
import { VenueModal } from './design/VenueModal';
import { PublicationMentionModal } from './architecture/PublicationMentionModal';
import { AwardModal } from './architecture/AwardModal';
import { ExhibitionModal } from './architecture/ExhibitionModal';
import { getArtisticOutputName } from '../../../../../utils/registration-helpers';
import { BroadcastModal } from './moving_picture/BroadcastModal';
import { CinematicReleaseModal } from './moving_picture/CinematicReleaseModal';
import { OtherReleaseModal } from './moving_picture/OtherReleaseModal';
import { MusicScoreModal } from './music_performance/MusicScoreModal';
import { AudioVisualPublicationModal } from './music_performance/AudioVisualPublicationModal';
import { ConcertModal } from './music_performance/ConcertModal';
import { OtherPerformanceModal } from './music_performance/OtherPerformanceModal';

interface OutputRowProps {
  item: ArtisticOutputItem;
  updateItem: (item: ArtisticOutputItem) => void;
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

  switch (item.type) {
    case 'Competition':
    case 'MentionInPublication':
    case 'Award':
    case 'Exhibition':
    case 'Broadcast':
    case 'CinematicRelease':
    case 'OtherRelease':
    case 'MusicScore':
    case 'AudioVisualPublication':
    case 'Concert':
    case 'OtherPerformance':
      removeItemTitle = t('resource_type.artistic.remove_announcement');
      removeItemDescription = t('resource_type.artistic.remove_announcement_description', { name: title });
      break;
    case 'Venue':
    case 'PerformingArtsVenue':
      removeItemTitle = t('resource_type.artistic.remove_venue_title');
      removeItemDescription = t('resource_type.artistic.remove_venue_text', { name: title });
      break;
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
      {item.type === 'Broadcast' ? (
        <BroadcastModal
          broadcast={item as Broadcast}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'Competition' ? (
        <CompetitionModal
          competition={item as Competition}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'Venue' || item.type === 'PerformingArtsVenue' ? (
        <VenueModal
          venue={item as Venue}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'MentionInPublication' ? (
        <PublicationMentionModal
          mentionInPublication={item as MentionInPublication}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'Award' ? (
        <AwardModal
          award={item as Award}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'Exhibition' ? (
        <ExhibitionModal
          exhibition={item as Exhibition}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'CinematicRelease' ? (
        <CinematicReleaseModal
          cinematicRelease={item as CinematicRelease}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'OtherRelease' ? (
        <OtherReleaseModal
          otherRelease={item as OtherRelease}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'MusicScore' ? (
        <MusicScoreModal
          musicScore={item as MusicScore}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'AudioVisualPublication' ? (
        <AudioVisualPublicationModal
          audioVisualPublication={item as AudioVisualPublication}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'Concert' ? (
        <ConcertModal
          concert={item as Concert}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'OtherPerformance' ? (
        <OtherPerformanceModal
          otherPerformance={item as OtherMusicPerformance}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : null}
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
