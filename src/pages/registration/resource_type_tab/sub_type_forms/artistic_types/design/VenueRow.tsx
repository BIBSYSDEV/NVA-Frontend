import { TableRow, TableCell, Typography, Button, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Venue } from '../../../../../../types/publication_types/artisticRegistration.types';
import { getPeriodString } from '../../../../../../utils/registration-helpers';
import { VenueModal } from './VenueModal';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import { lightTheme } from '../../../../../../themes/lightTheme';

interface VenueRowProps {
  venue: Venue;
  updateVenue: (venue: Venue) => void;
  removeVenue: () => void;
  index: number;
}

export const VenueRow = ({ updateVenue, removeVenue, venue, index }: VenueRowProps) => {
  const { t } = useTranslation('common');
  const [openEditVenue, setOpenEditVenue] = useState(false);
  const [openRemoveVenue, setOpenRemoveVenue] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Typography>{venue.name}</Typography>
      </TableCell>
      <TableCell>{getPeriodString(venue.time)}</TableCell>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Button onClick={() => setOpenEditVenue(true)} variant="outlined" sx={{ mr: '1rem' }} startIcon={<EditIcon />}>
          {t('edit')}
        </Button>
        <Button onClick={() => setOpenRemoveVenue(true)} variant="contained" color="error" startIcon={<DeleteIcon />}>
          {t('remove')}
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
          title={t('registration:resource_type.remove_venue_title')}
          onCancel={() => setOpenRemoveVenue(false)}
          onAccept={() => {
            removeVenue();
            setOpenRemoveVenue(false);
          }}>
          {t('registration:resource_type.remove_venue_text', { name: venue.name })}
        </ConfirmDialog>
      </ThemeProvider>
    </TableRow>
  );
};
