import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OrcidLogo from '../resources/images/orcid_logo.svg';

interface ContributorIndicatorsProps {
  orcId?: string;
  correspondingAuthor?: boolean;
  ticketView?: boolean;
}

export const ContributorIndicators = ({
  orcId,
  correspondingAuthor,
  ticketView = false,
}: ContributorIndicatorsProps) => {
  const { t } = useTranslation();

  return orcId || correspondingAuthor ? (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: '0.2rem' }}>
      {orcId && (
        <Tooltip title={t('common.orcid_profile')}>
          {ticketView ? (
            <img src={OrcidLogo} height="20" alt="orcid" />
          ) : (
            <IconButton size="small" href={orcId} target="_blank" style={{ padding: 0 }}>
              <img src={OrcidLogo} height="20" alt="orcid" />
            </IconButton>
          )}
        </Tooltip>
      )}
      {correspondingAuthor && (
        <Tooltip title={t('registration.contributors.corresponding')}>
          <MailOutlineIcon />
        </Tooltip>
      )}
    </Box>
  ) : null;
};
