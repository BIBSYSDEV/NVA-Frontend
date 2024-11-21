import NotesIcon from '@mui/icons-material/Notes';
import { Box, Typography, TypographyProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublicationInstanceType, RegistrationDate } from '../types/registration.types';
import { displayDate } from '../utils/date-helpers';

interface RegistrationIconHeaderProps {
  publicationInstanceType?: PublicationInstanceType | '';
  publicationDate?: Omit<RegistrationDate, 'type'>;
  showYearOnly?: boolean;
  textColor?: TypographyProps['color'];
}

export const RegistrationIconHeader = ({
  publicationInstanceType,
  publicationDate,
  showYearOnly = false,
  textColor,
}: RegistrationIconHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <NotesIcon sx={{ bgcolor: 'registration.main', borderRadius: '0.4rem', color: 'black' }} />

      <Typography color={textColor}>
        {publicationInstanceType ? t(`registration.publication_types.${publicationInstanceType}`) : t('common.result')}
      </Typography>

      {publicationDate?.year && (
        <Typography sx={{ fontWeight: 'bold', color: textColor }}>
          {showYearOnly ? publicationDate.year : displayDate(publicationDate)}
        </Typography>
      )}
    </Box>
  );
};
