import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Skeleton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchRegistration } from '../../../../../api/hooks/useFetchRegistration';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import {
  ArtisticOutputItem,
  AudioVisualPublication,
  Award,
  Broadcast,
  CinematicRelease,
  Competition,
  Concert,
  Exhibition,
  LiteraryArtsAudioVisual,
  LiteraryArtsMonograph,
  LiteraryArtsPerformance,
  LiteraryArtsWeb,
  MentionInPublication,
  MusicScore,
  OtherMusicPerformance,
  OtherRelease,
  Venue,
} from '../../../../../types/publication_types/artisticRegistration.types';
import {
  ExhibitionBasic,
  ExhibitionCatalog,
  ExhibitionManifestation,
} from '../../../../../types/publication_types/exhibitionContent.types';
import { getIdentifierFromId } from '../../../../../utils/general-helpers';
import { getOutputName } from '../../../../../utils/registration-helpers';
import { ExhibitionBasicModal } from '../exhibition_types/ExhibitionBasicModal';
import { ExhibitionCatalogModal } from '../exhibition_types/ExhibitionCatalogModal';
import { AwardModal } from './architecture/AwardModal';
import { CompetitionModal } from './architecture/CompetitionModal';
import { ExhibitionModal } from './architecture/ExhibitionModal';
import { PublicationMentionModal } from './architecture/PublicationMentionModal';
import { VenueModal } from './design/VenueModal';
import { LiteraryArtsAudioVisualModal } from './literary_art/LiteraryArtsAudioVisualModal';
import { LiteraryArtsMonographModal } from './literary_art/LiteraryArtsMonographModal';
import { LiteraryArtsPerformanceModal } from './literary_art/LiteraryArtsPerformanceModal';
import { LiteraryArtsWebPublicationModal } from './literary_art/LiteraryArtsWebPublicationModal';
import { BroadcastModal } from './moving_picture/BroadcastModal';
import { CinematicReleaseModal } from './moving_picture/CinematicReleaseModal';
import { OtherReleaseModal } from './moving_picture/OtherReleaseModal';
import { AudioVisualPublicationModal } from './music_performance/AudioVisualPublicationModal';
import { ConcertModal } from './music_performance/ConcertModal';
import { MusicScoreModal } from './music_performance/MusicScoreModal';
import { OtherPerformanceModal } from './music_performance/OtherPerformanceModal';

export type OutputItem = ArtisticOutputItem | ExhibitionManifestation;

interface OutputRowProps {
  item: OutputItem;
  updateItem: (item: OutputItem) => void;
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

  const shouldFetchItem = item.type === 'ExhibitionCatalog';
  const exhibitionCatalogIdentifier = shouldFetchItem && item.id ? getIdentifierFromId(item.id) : '';

  const exhibitionCatalogQuery = useFetchRegistration(exhibitionCatalogIdentifier);

  const title = shouldFetchItem ? exhibitionCatalogQuery.data?.entityDescription?.mainTitle : getOutputName(item);

  return (
    <TableRow>
      {showTypeColumn && (
        <TableCell>
          <Typography>{t(`registration.resource_type.artistic.output_type.${item.type}` as any)}</Typography>
        </TableCell>
      )}
      <TableCell>
        {shouldFetchItem ? (
          exhibitionCatalogQuery.isPending ? (
            <Skeleton />
          ) : (
            <Typography>{exhibitionCatalogQuery.data?.entityDescription?.mainTitle}</Typography>
          )
        ) : (
          <Typography>{title}</Typography>
        )}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={t('common.move_down')}>
            <span>
              <Button disabled={index === maxIndex} onClick={() => moveItem(index + 1)}>
                <ArrowDownwardIcon />
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={t('common.move_up')}>
            <span>
              <Button disabled={index === 0} onClick={() => moveItem(index - 1)}>
                <ArrowUpwardIcon />
              </Button>
            </span>
          </Tooltip>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: '0.5rem 1rem' }}>
          <Button onClick={() => setOpenEditItem(true)} variant="outlined" size="small" startIcon={<EditIcon />}>
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
        </Box>
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
      ) : item.type === 'ExhibitionBasic' ? (
        <ExhibitionBasicModal
          exhibitionBasic={item as ExhibitionBasic}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : item.type === 'ExhibitionCatalog' ? (
        <ExhibitionCatalogModal
          exhibitionCatalog={item as ExhibitionCatalog}
          onSubmit={updateItem}
          open={openEditItem}
          closeModal={() => setOpenEditItem(false)}
        />
      ) : null}
      <ConfirmDialog
        open={openRemoveItem}
        title={t('registration.resource_type.artistic.remove_announcement')}
        onCancel={() => setOpenRemoveItem(false)}
        onAccept={() => {
          removeItem();
          setOpenRemoveItem(false);
        }}>
        {t('registration.resource_type.artistic.remove_announcement_description', { name: title })}
      </ConfirmDialog>
    </TableRow>
  );
};
