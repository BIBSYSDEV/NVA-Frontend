import NotesIcon from '@mui/icons-material/Notes';
import { Box, Typography, TypographyProps } from '@mui/material';
import { PublicationInstanceType, RegistrationDate } from '../types/registration.types';
import { DateText } from './RegistrationListItem/components/DateText';
import { PublicationInstanceText } from './RegistrationListItem/components/PublicationInstanceText';

interface RegistrationIconHeaderProps {
  publicationInstanceType?: PublicationInstanceType | '';
  publicationDate?: Omit<RegistrationDate, 'type'>;
  showYearOnly?: boolean;
  textColor?: TypographyProps['color'];
  publicationChannelName?: string;
}

export const RegistrationIconHeader = ({
  publicationInstanceType,
  publicationDate,
  showYearOnly = false,
  textColor,
  publicationChannelName,
}: RegistrationIconHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <NotesIcon sx={{ bgcolor: 'registration.main', color: 'primary.main', borderRadius: '0.4rem' }} />
      <PublicationInstanceText publicationInstanceType={publicationInstanceType} textColor={textColor} />
      {publicationDate?.year && (
        <DateText publicationDate={publicationDate} showYearOnly={showYearOnly} textColor={textColor} />
      )}
      {!!publicationChannelName && <Typography>| {publicationChannelName}</Typography>}
    </Box>
  );
};
