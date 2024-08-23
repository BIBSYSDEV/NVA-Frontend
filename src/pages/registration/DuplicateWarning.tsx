import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { StyledInfoBanner } from '../../components/styled/Wrappers';
import { dataTestId } from '../../utils/dataTestIds';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

interface DuplicateWarningProps {
  warning: string;
  identifier?: string;
  name?: string;
}

export const DuplicateWarning = ({ name, identifier, warning }: DuplicateWarningProps) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        bgcolor: 'secondary.light',
        borderRadius: '0.25rem',
        width: '100%',
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
      <StyledInfoBanner>{warning}</StyledInfoBanner>
      {name && identifier && (
        <>
          <Typography sx={{ fontWeight: 'bold' }}>{t('common.result')}</Typography>
          <Link
            target="_blank"
            data-testid={dataTestId.registrationLandingPage.duplicateRegistrationLink}
            to={getRegistrationLandingPagePath(identifier)}>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Typography sx={{ textDecoration: 'underline', cursor: 'pointer' }}>{name}</Typography>
              <OpenInNewOutlinedIcon
                sx={{ cursor: 'pointer', color: 'primary.main', height: '1.3rem', width: '1.3rem' }}
              />
            </Box>
          </Link>
        </>
      )}
    </Box>
  );
};
