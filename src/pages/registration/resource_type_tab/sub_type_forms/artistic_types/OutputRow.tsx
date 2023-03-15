import { TableRow, TableCell, Typography, Button, Tooltip, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
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
  LiteraryArtsMonograph,
  LiteraryArtsWeb,
  LiteraryArtsPerformance,
  LiteraryArtsAudioVisual,
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
import { LiteraryArtsMonographModal } from './literary_art/LiteraryArtsMonographModalModal';
import { LiteraryArtsWebPublicationModal } from './literary_art/LiteraryArtsWebPublicationModal';
import { LiteraryArtsPerformanceModal } from './literary_art/LiteraryArtsPerformanceModal';
import { LiteraryArtsAudioVisualModal } from './literary_art/LiteraryArtsAudioVisualModal';

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
  const { t } = useTranslation();
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
    case 'LiteraryArtsMonograph':
    case 'LiteraryArtsPerformance':
    case 'LiteraryArtsAudioVisual':
    case 'LiteraryArtsWeb':
      removeItemTitle = t('registration.resource_type.artistic.remove_announcement');
      removeItemDescription = t('registration.resource_type.artistic.remove_announcement_description', { name: title });
      break;
    case 'Venue':
    case 'PerformingArtsVenue':
      removeItemTitle = t('registration.resource_type.artistic.remove_venue_title');
      removeItemDescription = t('registration.resource_type.artistic.remove_venue_text', { name: title });
      break;
  }

  return (
    <TableRow>
      {showTypeColumn && (
        <TableCell>
          <Typography>{t(`registration.resource_type.artistic.output_type.${item.type}` as any)}</Typography>
        </TableCell>
      )}
      <TableCell>
        <Typography>{title}</Typography>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'grid', gridTemplateAreas: '"down up"', gridTemplateColumns: '1fr 1fr', maxWidth: '8rem' }}>
          <Tooltip title={t('common.move_down')} sx={{ gridArea: 'down' }}>
            <Button disabled={index === maxIndex} onClick={() => moveItem(index + 1)}>
              <ArrowDownwardIcon />
            </Button>
          </Tooltip>

          <Tooltip title={t('common.move_up')} sx={{ gridArea: 'up' }}>
            <Button disabled={index === 0} onClick={() => moveItem(index - 1)}>
              <ArrowUpwardIcon />
            </Button>
          </Tooltip>
        </Box>
      </TableCell>
      <TableCell>
        <Button
          onClick={() => setOpenEditItem(true)}
          variant="outlined"
          sx={{ mr: '1rem' }}
          size="small"
          startIcon={<EditIcon />}>
          {t('common.show')}/{t('common.edit')}
        </Button>
        <Button
          onClick={() => setOpenRemoveItem(true)}
          variant="outlined"
          color="error"
          size="small"
          startIcon={<CancelIcon />}>
          {t('common.remove')}
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
      ) : item.type === 'LiteraryArtsMonograph' ? (
        <LiteraryArtsMonographModal
          literaryArtsMonograph={item as LiteraryArtsMonograph}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'LiteraryArtsWeb' ? (
        <LiteraryArtsWebPublicationModal
          webPublication={item as LiteraryArtsWeb}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'LiteraryArtsPerformance' ? (
        <LiteraryArtsPerformanceModal
          performance={item as LiteraryArtsPerformance}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'LiteraryArtsAudioVisual' ? (
        <LiteraryArtsAudioVisualModal
          audioVisual={item as LiteraryArtsAudioVisual}
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
