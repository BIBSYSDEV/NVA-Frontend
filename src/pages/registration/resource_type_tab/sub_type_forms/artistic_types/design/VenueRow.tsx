import { TableRow, TableCell, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Venue } from '../../../../../../types/publication_types/artisticRegistration.types';
import { getPeriodString } from '../../../../../../utils/registration-helpers';
import { VenueModal } from './VenueModal';

interface VenueRowProps {
  venue: Venue;
  updateVenue: (venue: Venue) => void;
  removeVenue: () => void;
  index: number;
}

export const VenueRow = ({ updateVenue, removeVenue, venue, index }: VenueRowProps) => {
  const { t } = useTranslation('common');
  const [openEditVenue, setOpenEditVenue] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Typography>{venue.name}</Typography>
      </TableCell>
      <TableCell>{getPeriodString(venue.time)}</TableCell>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Button onClick={() => setOpenEditVenue(true)} variant="outlined" sx={{ marginRight: '1rem' }}>
          {t('edit')}
        </Button>
        <Button onClick={removeVenue} variant="contained" color="error">
          {t('remove')}
        </Button>
      </TableCell>
      <VenueModal
        venue={venue}
        onSubmit={updateVenue}
        open={openEditVenue}
        closeModal={() => setOpenEditVenue(false)}
      />
    </TableRow>
  );
};
