import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';

interface SameNameWarningProps {
  name: string;
  id: string;
}

export const SameNameWarning = ({ name, id }: SameNameWarningProps) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        bgcolor: 'secondary.light',
        width: '100%',
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
      <Box sx={{ bgcolor: 'primary.light', color: 'white', p: '0.5rem', borderRadius: '0.25rem' }}>
        {t('registration.description.duplicate_title_warning')}
      </Box>
      <Typography sx={{ fontWeight: 'bold' }}>{t('common.result')}</Typography>
      <Link
        target="_blank"
        data-testid={dataTestId.registrationLandingPage.duplicateRegistrationSearchLink}
        to={`${UrlPathTemplate.RegistrationNew}/${id}`}>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Typography sx={{ textDecoration: 'underline', cursor: 'pointer' }}>{name}</Typography>
          <OpenInNewOutlinedIcon sx={{ cursor: 'pointer', color: 'primary.main', height: '1.3rem', width: '1.3rem' }} />
        </Box>
      </Link>
    </Box>
  );
};
