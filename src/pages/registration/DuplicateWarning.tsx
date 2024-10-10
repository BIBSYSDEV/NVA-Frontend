import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { StyledInfoBanner } from '../../components/styled/Wrappers';
import { dataTestId } from '../../utils/dataTestIds';

interface DuplicateWarningProps extends Pick<BoxProps, 'sx'> {
  warning: string;
  linkTo?: string;
  name?: string;
}

export const DuplicateWarning = ({ name, linkTo, warning, sx }: DuplicateWarningProps) => {
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
        ...sx,
      }}>
      <StyledInfoBanner>{warning}</StyledInfoBanner>
      {name && linkTo && (
        <>
          <Typography sx={{ fontWeight: 'bold' }}>{t('common.result')}</Typography>
          <Link target="_blank" data-testid={dataTestId.registrationLandingPage.duplicateRegistrationLink} to={linkTo}>
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
