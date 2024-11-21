import NotesIcon from '@mui/icons-material/Notes';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublicationInstanceType, RegistrationDate } from '../types/registration.types';
import { displayDate } from '../utils/date-helpers';

interface RegistrationIconHeaderProps {
  publicationInstanceType?: PublicationInstanceType | '';
  publicationDate?: Omit<RegistrationDate, 'type'>;
  showYearOnly?: boolean;
}

export const RegistrationIconHeader = ({
  publicationInstanceType,
  publicationDate,
  showYearOnly = false,
}: RegistrationIconHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <NotesIcon sx={{ bgcolor: 'registration.main', borderRadius: '0.4rem', color: 'black' }} />

      <Typography sx={{ color: 'primary.main' }}>
        {publicationInstanceType ? t(`registration.publication_types.${publicationInstanceType}`) : t('common.result')}
      </Typography>

      {publicationDate?.year && (
        <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {showYearOnly ? publicationDate.year : displayDate(publicationDate)}
        </Typography>
      )}
    </Box>
  );
};
