import { TableRow, TableCell, Typography, Button, ThemeProvider, Tooltip, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Venue } from '../../../../../../types/publication_types/artisticRegistration.types';
import { getPeriodString } from '../../../../../../utils/registration-helpers';
import { VenueModal } from './VenueModal';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import { lightTheme } from '../../../../../../themes/lightTheme';

interface VenueRowProps {
  venue: Venue;
  updateVenue: (venue: Venue) => void;
  removeVenue: () => void;
  moveVenue: (to: number) => void;
  index: number;
  maxIndex: number;
}

export const VenueRow = ({ updateVenue, removeVenue, moveVenue, venue, index, maxIndex }: VenueRowProps) => {
  const { t } = useTranslation('registration');
  const [openEditVenue, setOpenEditVenue] = useState(false);
  const [openRemoveVenue, setOpenRemoveVenue] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Typography>{venue.name}</Typography>
      </TableCell>
      <TableCell>{getPeriodString(venue.time)}</TableCell>
      <TableCell>
        {maxIndex !== 0 && (
          <Box
            sx={{ display: 'grid', gridTemplateAreas: "'down up'", gridTemplateColumns: '1fr 1fr', maxWidth: '8rem' }}>
            {index !== maxIndex && (
              <Tooltip title={t<string>('common:move_down')} sx={{ gridArea: 'down' }}>
                <Button color="secondary" onClick={() => moveVenue(index + 1)} sx={{ minWidth: 'auto' }}>
                  <ArrowDownwardIcon />
                </Button>
              </Tooltip>
            )}
            {index !== 0 && (
              <Tooltip title={t<string>('common:move_up')} sx={{ gridArea: 'up' }}>
                <Button color="secondary" onClick={() => moveVenue(index - 1)}>
                  <ArrowUpwardIcon />
                </Button>
              </Tooltip>
            )}
          </Box>
        )}
      </TableCell>
      <TableCell>
        <Button onClick={() => setOpenEditVenue(true)} variant="outlined" sx={{ mr: '1rem' }} startIcon={<EditIcon />}>
          {t('common:edit')}
        </Button>
        <Button onClick={() => setOpenRemoveVenue(true)} variant="contained" color="error" startIcon={<DeleteIcon />}>
          {t('common:remove')}
        </Button>
      </TableCell>
      <VenueModal
        venue={venue}
        onSubmit={updateVenue}
        open={openEditVenue}
        closeModal={() => setOpenEditVenue(false)}
      />
      <ThemeProvider theme={lightTheme}>
        <ConfirmDialog
          open={openRemoveVenue}
          title={t('resource_type.remove_venue_title')}
          onCancel={() => setOpenRemoveVenue(false)}
          onAccept={() => {
            removeVenue();
            setOpenRemoveVenue(false);
          }}>
          {t('resource_type.remove_venue_text', { name: venue.name })}
        </ConfirmDialog>
      </ThemeProvider>
    </TableRow>
  );
};
