import NotesIcon from '@mui/icons-material/Notes';
import { Box, Typography, TypographyProps } from '@mui/material';
import { otherArtisticSubtypes } from '../pages/public_registration/PublicPublicationInstance';
import { ArtisticPublicationInstance } from '../types/publication_types/artisticRegistration.types';
import { PublicationInstanceType, RegistrationDate } from '../types/registration.types';
import { isOtherSubtype } from '../utils/registration-helpers';
import { DateText } from './RegistrationListItem/components/DateText';
import { PublicationInstanceText } from './RegistrationListItem/components/PublicationInstanceText';

interface RegistrationIconHeaderProps {
  publicationInstanceType?: PublicationInstanceType | '';
  publicationDate?: Omit<RegistrationDate, 'type'>;
  showYearOnly?: boolean;
  textColor?: TypographyProps['color'];
  publicationChannelName?: string;
  publicationInstance?: ArtisticPublicationInstance;
}

export const RegistrationIconHeader = ({
  publicationInstanceType,
  publicationDate,
  showYearOnly = false,
  textColor,
  publicationChannelName,
  publicationInstance: publicationInstance,
}: RegistrationIconHeaderProps) => {
  const subtype = publicationInstance?.subtype;
  const typeDescription = publicationInstance?.typeDescription;

  const typeString =
    subtype?.type && isOtherSubtype(subtype)
      ? otherArtisticSubtypes.includes(subtype.type) && subtype.description
        ? subtype.description
        : subtype.type
      : typeDescription
        ? typeDescription
        : null;

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <NotesIcon sx={{ bgcolor: 'registration.main', color: 'primary.main', borderRadius: '0.4rem' }} />
      <PublicationInstanceText publicationInstanceType={publicationInstanceType} textColor={textColor} />
      {!!typeString && (
        <Typography color={textColor} fontWeight="bold">
          {typeString}
        </Typography>
      )}
      {publicationDate?.year && (
        <DateText publicationDate={publicationDate} showYearOnly={showYearOnly} textColor={textColor} />
      )}
      {!!publicationChannelName && <Typography color={textColor}>| {publicationChannelName}</Typography>}
    </Box>
  );
};
